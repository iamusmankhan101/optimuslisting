import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data || !data.email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();

    const query = `
      INSERT INTO property_listings (
        email, source_of_listing, category, sub_category, purpose,
        property_code, emirate, area_community, building_name, unit_number, google_pin,
        bedrooms, bathrooms, size_sqft, maid_room, furnishing, property_condition,
        sale_price, unit_status, rented_details, notice_given, sales_agent_commission,
        asking_rent, number_of_chq, security_deposit, rent_agent_commission,
        keys_status, viewing_status, more_information,
        agent_code, agent_name, agent_mobile, agent_email, agent_agency
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
      ) RETURNING id;
    `;

    const values = [
      data.email,
      data.source_of_listing || null,
      data.category || null,
      data.sub_category || null,
      data.purpose || null,
      data.property_code || null,
      data.emirate || null,
      data.area_community || null,
      data.building_name || null,
      data.unit_number || null,
      data.google_pin || null,
      data.bedrooms || null,
      data.bathrooms || null,
      data.size_sqft || null,
      data.maid_room || null,
      data.furnishing || null,
      data.property_condition || null,
      data.sale_price || null,
      data.unit_status || null,
      data.rented_details || null,
      data.notice_given || null,
      data.sales_agent_commission || null,
      data.asking_rent || null,
      data.number_of_chq || null,
      data.security_deposit || null,
      data.rent_agent_commission || null,
      data.keys_status || null,
      data.viewing_status || null,
      data.more_information || null,
      data.agent_code || null,
      data.agent_name || null,
      data.agent_mobile || null,
      data.agent_email || null,
      data.agent_agency || null
    ];

    const result = await client.query(query, values);
    const id = result.rows[0].id;

    // Send to Google Sheets
    try {
      const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (googleSheetWebhookUrl) {
        await fetch(googleSheetWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id, created_at: new Date().toISOString() })
        });
      }
    } catch (err) {
      console.error('Error syncing to Google Sheets:', err.message);
    }

    client.release();
    pool.end();

    res.json({
      success: true,
      id
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
}
