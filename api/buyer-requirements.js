const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const sql = neon(process.env.DATABASE_URL);

        if (req.method === 'GET') {
            const requirements = await sql`
                SELECT * FROM buyer_requirements 
                ORDER BY created_at DESC
            `;
            
            return res.status(200).json({ 
                success: true, 
                requirements 
            });
        }

        if (req.method === 'POST') {
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
                additional_requirements
            } = req.body;

            // Validate required fields
            if (!name || !email || !phone || !purpose || !category || !sub_category || !emirate || !bedrooms || !bathrooms || !min_budget || !max_budget) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields' 
                });
            }

            // Insert into database using parameterized query
            const result = await sql`
                INSERT INTO buyer_requirements (
                    name, email, phone, purpose, category, sub_category, 
                    emirate, preferred_areas, bedrooms, bathrooms, 
                    min_size_sqft, max_size_sqft, maid_room, furnishing,
                    min_budget, max_budget, payment_method, 
                    additional_requirements, created_at
                ) VALUES (
                    ${name}, ${email}, ${phone}, ${purpose}, ${category}, ${sub_category},
                    ${emirate}, ${preferred_areas || null}, ${bedrooms}, ${bathrooms},
                    ${min_size_sqft || null}, ${max_size_sqft || null}, ${maid_room || null}, ${furnishing || null},
                    ${min_budget}, ${max_budget}, ${payment_method || null},
                    ${additional_requirements || null}, NOW()
                )
                RETURNING id
            `;

            const id = result[0].id;

            // Send to Google Sheets
            let googleSheetsSuccess = false;
            try {
                const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
                if (googleSheetWebhookUrl) {
                    console.log('Sending buyer requirements to Google Sheets...');
                    
                    const googleSheetsPayload = {
                        sheet: 'BuyerRequirements',
                        data: {
                            id,
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
                            additional_requirements
                        }
                    };
                    
                    const response = await fetch(googleSheetWebhookUrl, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(googleSheetsPayload)
                    });
                    
                    const responseText = await response.text();
                    console.log('Google Sheets response:', response.status, responseText);
                    
                    if (response.ok || response.status === 302) {
                        googleSheetsSuccess = true;
                    } else {
                        console.error('Google Sheets error:', response.status, responseText);
                    }
                } else {
                    console.warn('GOOGLE_SHEET_WEBHOOK_URL not configured');
                }
            } catch (err) {
                console.error('Error syncing to Google Sheets:', err.message, err);
            }

            return res.status(200).json({ 
                success: true, 
                message: 'Buyer requirements submitted successfully',
                id,
                googleSheetsSync: googleSheetsSuccess
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error in buyer-requirements:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
