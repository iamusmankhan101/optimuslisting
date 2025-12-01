require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function setupBuyerTable() {
    try {
        console.log('Connecting to Neon database...');
        const sql = neon(process.env.DATABASE_URL);

        console.log('Creating buyer_requirements table...');
        
        await sql`
            CREATE TABLE IF NOT EXISTS buyer_requirements (
                id SERIAL PRIMARY KEY,
                
                -- Contact Information
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                
                -- Property Type
                purpose VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                sub_category VARCHAR(100) NOT NULL,
                
                -- Location Preferences
                emirate VARCHAR(100) NOT NULL,
                preferred_areas TEXT,
                
                -- Property Specifications
                bedrooms VARCHAR(50) NOT NULL,
                bathrooms VARCHAR(50) NOT NULL,
                min_size_sqft VARCHAR(50),
                max_size_sqft VARCHAR(50),
                maid_room VARCHAR(50),
                furnishing VARCHAR(100),
                
                -- Budget
                min_budget VARCHAR(100) NOT NULL,
                max_budget VARCHAR(100) NOT NULL,
                payment_method VARCHAR(100),
                move_in_date DATE,
                
                -- Additional Information
                additional_requirements TEXT,
                
                -- Status tracking
                status VARCHAR(50) DEFAULT 'New',
                assigned_to VARCHAR(255),
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Creating indexes...');
        
        await sql`CREATE INDEX IF NOT EXISTS idx_buyer_requirements_email ON buyer_requirements(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_buyer_requirements_emirate ON buyer_requirements(emirate)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_buyer_requirements_status ON buyer_requirements(status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_buyer_requirements_created_at ON buyer_requirements(created_at)`;

        console.log('✅ Buyer requirements table created successfully!');
        
        // Test query
        const result = await sql`SELECT COUNT(*) as count FROM buyer_requirements`;
        console.log(`Current buyer requirements count: ${result[0].count}`);

    } catch (error) {
        console.error('❌ Error setting up buyer requirements table:', error);
        process.exit(1);
    }
}

setupBuyerTable();
