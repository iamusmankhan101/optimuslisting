require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function checkTable() {
    try {
        const sql = neon(process.env.DATABASE_URL);
        
        console.log('Checking buyer_requirements table structure...\n');
        
        // Get column information
        const columns = await sql`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'buyer_requirements'
            ORDER BY ordinal_position;
        `;
        
        console.log('Columns in buyer_requirements table:');
        console.log('=====================================');
        columns.forEach(col => {
            console.log(`${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`);
        });
        
        console.log('\n✅ Table structure retrieved successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkTable();
