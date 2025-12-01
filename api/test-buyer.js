const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        // Test if table exists
        const tableCheck = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'buyer_requirements'
            );
        `;
        
        const tableExists = tableCheck[0].exists;
        
        if (!tableExists) {
            return res.status(200).json({
                success: false,
                message: 'buyer_requirements table does not exist',
                solution: 'Run: node setup-buyer-table.cjs'
            });
        }
        
        // Count records
        const count = await sql`SELECT COUNT(*) as count FROM buyer_requirements`;
        
        res.status(200).json({
            success: true,
            message: 'buyer_requirements table exists',
            count: count[0].count,
            database: 'Connected to Neon PostgreSQL'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Check DATABASE_URL environment variable'
        });
    }
};
