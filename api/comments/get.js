import { neon } from '@neondatabase/serverless';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { property_listing_id } = req.query;

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    let query = 'SELECT * FROM comments';
    let params = [];

    if (property_listing_id) {
      query += ' WHERE property_listing_id = $1';
      params.push(property_listing_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await sql(query, params);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}
