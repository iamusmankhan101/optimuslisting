const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const sql = neon(process.env.DATABASE_URL);
            const requirements = await sql`
                SELECT * FROM buyer_requirements 
                ORDER BY created_at DESC
            `;
            
            return res.status(200).json({ 
                success: true, 
                requirements 
            });
        } catch (error) {
            console.error('Error fetching buyer requirements:', error);
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        const {
            name,
            email,
            phone,
            purpose,
            category,
            sub_category,
            emirate,
            preferred_areas,
            bedrooms,
            bathrooms,
            min_size_sqft,
            max_size_sqft,
            maid_room,
            furnishing,
            min_budget,
            max_budget,
            payment_method,
            move_in_date,
            additional_requirements
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !purpose || !category || !sub_category || !emirate || !bedrooms || !bathrooms || !min_budget || !max_budget) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        // Insert into database
        const result = await sql`
            INSERT INTO buyer_requirements (
                name, email, phone, purpose, category, sub_category, 
                emirate, preferred_areas, bedrooms, bathrooms, 
                min_size_sqft, max_size_sqft, maid_room, furnishing,
                min_budget, max_budget, payment_method, move_in_date, 
                additional_requirements, created_at
            ) VALUES (
                ${name}, ${email}, ${phone}, ${purpose}, ${category}, ${sub_category},
                ${emirate}, ${preferred_areas}, ${bedrooms}, ${bathrooms},
                ${min_size_sqft}, ${max_size_sqft}, ${maid_room}, ${furnishing},
                ${min_budget}, ${max_budget}, ${payment_method}, ${move_in_date},
                ${additional_requirements}, NOW()
            )
            RETURNING id
        `;

        // Also log to Google Sheets if configured
        const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
        if (sheetsUrl && !sheetsUrl.includes('YOUR_DEPLOYMENT_ID')) {
            try {
                await fetch(sheetsUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sheet: 'BuyerRequirements',
                        data: req.body
                    })
                });
            } catch (sheetsError) {
                console.error('Google Sheets logging failed:', sheetsError);
                // Continue even if sheets logging fails
            }
        }

        res.status(200).json({ 
            success: true, 
            message: 'Buyer requirements submitted successfully',
            id: result[0].id
        });

    } catch (error) {
        console.error('Error submitting buyer requirements:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to submit requirements' 
        });
    }
};
