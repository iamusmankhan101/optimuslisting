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
            max_budget,
            min_size_sqft,
            max_size_sqft
        } = req.body;

        // Build dynamic query - Focus on: Budget, Location, and Property Specifications
        let query = 'SELECT * FROM property_listings WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // LOCATION MATCH - Emirate (Required)
        if (emirate) {
            query += ' AND emirate = $' + paramIndex;
            params.push(emirate);
            paramIndex++;
        }

        // PROPERTY SPECIFICATIONS - Bedrooms (Required)
        if (bedrooms) {
            if (bedrooms === 'Studio') {
                query += " AND bedrooms = 'Studio'";
            } else if (bedrooms === '6+') {
                query += " AND (bedrooms = '6+' OR CAST(bedrooms AS INTEGER) >= 6)";
            } else {
                // Match exact or higher
                query += ' AND (bedrooms = $' + paramIndex + " OR bedrooms = '" + bedrooms + "+' OR CAST(bedrooms AS INTEGER) >= " + bedrooms + ')';
                params.push(bedrooms);
                paramIndex++;
            }
        }

        // PROPERTY SPECIFICATIONS - Bathrooms (Required)
        if (bathrooms) {
            if (bathrooms === '5+') {
                query += " AND (bathrooms = '5+' OR CAST(bathrooms AS INTEGER) >= 5)";
            } else {
                // Match exact or higher
                query += ' AND (bathrooms = $' + paramIndex + " OR bathrooms = '" + bathrooms + "+' OR CAST(bathrooms AS INTEGER) >= " + bathrooms + ')';
                params.push(bathrooms);
                paramIndex++;
            }
        }

        // PROPERTY SPECIFICATIONS - Size Range (Optional)
        if (min_size_sqft && max_size_sqft) {
            query += " AND CAST(NULLIF(REGEXP_REPLACE(size_sqft, '[^0-9]', '', 'g'), '') AS INTEGER) BETWEEN $" + paramIndex + ' AND $' + (paramIndex + 1);
            params.push(min_size_sqft, max_size_sqft);
            paramIndex += 2;
        } else if (min_size_sqft) {
            query += " AND CAST(NULLIF(REGEXP_REPLACE(size_sqft, '[^0-9]', '', 'g'), '') AS INTEGER) >= $" + paramIndex;
            params.push(min_size_sqft);
            paramIndex++;
        } else if (max_size_sqft) {
            query += " AND CAST(NULLIF(REGEXP_REPLACE(size_sqft, '[^0-9]', '', 'g'), '') AS INTEGER) <= $" + paramIndex;
            params.push(max_size_sqft);
            paramIndex++;
        }

        // BUDGET MATCH - Based on Purpose (Required)
        if (min_budget && max_budget) {
            if (purpose === 'Buy') {
                // Match against sale price
                query += " AND (purpose = 'Sale' OR purpose = 'Both')";
                query += " AND CAST(NULLIF(REGEXP_REPLACE(sale_price, '[^0-9]', '', 'g'), '') AS BIGINT) BETWEEN $" + paramIndex + ' AND $' + (paramIndex + 1);
                params.push(min_budget, max_budget);
                paramIndex += 2;
            } else if (purpose === 'Rent') {
                // Match against asking rent
                query += " AND (purpose = 'Rent' OR purpose = 'Both')";
                query += " AND CAST(NULLIF(REGEXP_REPLACE(asking_rent, '[^0-9]', '', 'g'), '') AS BIGINT) BETWEEN $" + paramIndex + ' AND $' + (paramIndex + 1);
                params.push(min_budget, max_budget);
                paramIndex += 2;
            }
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
