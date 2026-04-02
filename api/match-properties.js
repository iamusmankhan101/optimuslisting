const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        const {
            purpose,
            emirate,
            bedrooms,
            bathrooms,
            min_budget,
            max_budget
        } = req.body;

        // Simple query without complex casting
        let query = 'SELECT * FROM property_listings WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // Match emirate
        if (emirate) {
            query += ' AND emirate = $' + paramIndex;
            params.push(emirate);
            paramIndex++;
        }

        // Match purpose
        if (purpose) {
            query += " AND (purpose = $" + paramIndex + " OR purpose = 'Both')";
            params.push(purpose);
            paramIndex++;
        }

        // Match bedrooms - simple string match
        if (bedrooms) {
            query += ' AND bedrooms = $' + paramIndex;
            params.push(bedrooms);
            paramIndex++;
        }

        // Match bathrooms - simple string match
        if (bathrooms) {
            query += ' AND bathrooms = $' + paramIndex;
            params.push(bathrooms);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC LIMIT 50';

        console.log('Match query:', query);
        console.log('Params:', params);

        const results = await sql(query, params);

        res.status(200).json({ 
            success: true, 
            matches: results,
            count: results.length
        });

    } catch (error) {
        console.error('Error matching properties:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to match properties'
        });
    }
};
