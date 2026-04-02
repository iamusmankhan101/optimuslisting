require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function testBuyerAPI() {
    try {
        console.log('Testing buyer requirements submission...');
        const sql = neon(process.env.DATABASE_URL);
        
        // Test data
        const testData = {
            name: 'Test Buyer',
            email: 'test@example.com',
            phone: '+971501234567',
            purpose: 'Buy',
            category: 'Residential',
            sub_category: 'Villa',
            emirate: 'Dubai',
            preferred_areas: 'Dubai Marina',
            bedrooms: '3',
            bathrooms: '2',
            min_size_sqft: '1500',
            max_size_sqft: '2500',
            maid_room: 'Required',
            furnishing: 'Furnished',
            min_budget: '2000000',
            max_budget: '3000000',
            payment_method: 'Cash',
            additional_requirements: 'Test requirements'
        };

        // Test insert
        console.log('Inserting test buyer requirement...');
        const result = await sql`
            INSERT INTO buyer_requirements (
                name, email, phone, purpose, category, sub_category, 
                emirate, preferred_areas, bedrooms, bathrooms, 
                min_size_sqft, max_size_sqft, maid_room, furnishing,
                min_budget, max_budget, payment_method, 
                additional_requirements, created_at
            ) VALUES (
                ${testData.name}, ${testData.email}, ${testData.phone}, 
                ${testData.purpose}, ${testData.category}, ${testData.sub_category},
                ${testData.emirate}, ${testData.preferred_areas}, 
                ${testData.bedrooms}, ${testData.bathrooms},
                ${testData.min_size_sqft}, ${testData.max_size_sqft}, 
                ${testData.maid_room}, ${testData.furnishing},
                ${testData.min_budget}, ${testData.max_budget}, 
                ${testData.payment_method}, ${testData.additional_requirements}, 
                NOW()
            )
            RETURNING id
        `;

        console.log('✅ Buyer requirement inserted successfully! ID:', result[0].id);

        // Test matching query
        console.log('\nTesting property matching...');
        let query = 'SELECT * FROM property_listings WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // Emirate
        if (testData.emirate) {
            query += ' AND emirate = $' + paramIndex;
            params.push(testData.emirate);
            paramIndex++;
        }

        // Bedrooms
        if (testData.bedrooms) {
            query += ' AND (bedrooms = $' + paramIndex + " OR bedrooms = '" + testData.bedrooms + "+' OR (bedrooms ~ '^[0-9]+$' AND CAST(bedrooms AS INTEGER) >= " + testData.bedrooms + '))';
            params.push(testData.bedrooms);
            paramIndex++;
        }

        // Bathrooms
        if (testData.bathrooms) {
            query += ' AND (bathrooms = $' + paramIndex + " OR bathrooms = '" + testData.bathrooms + "+' OR (bathrooms ~ '^[0-9]+$' AND CAST(bathrooms AS INTEGER) >= " + testData.bathrooms + '))';
            params.push(testData.bathrooms);
            paramIndex++;
        }

        // Budget
        if (testData.min_budget && testData.max_budget) {
            if (testData.purpose === 'Buy') {
                query += " AND (purpose = 'Sale' OR purpose = 'Both')";
                query += " AND CAST(NULLIF(REGEXP_REPLACE(sale_price, '[^0-9]', '', 'g'), '') AS BIGINT) BETWEEN $" + paramIndex + ' AND $' + (paramIndex + 1);
                params.push(testData.min_budget, testData.max_budget);
                paramIndex += 2;
            }
        }

        query += ' ORDER BY created_at DESC LIMIT 50';

        console.log('Query:', query);
        console.log('Params:', params);

        const matches = await sql(query, params);
        console.log('✅ Matching query executed successfully!');
        console.log('Found', matches.length, 'matching properties');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

testBuyerAPI();
