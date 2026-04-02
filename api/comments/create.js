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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { comment, property_listing_id, created_by } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql(
      'INSERT INTO comments (comment, property_listing_id, created_by) VALUES ($1, $2, $3) RETURNING id, created_at',
      [comment, property_listing_id || null, created_by || null]
    );

    res.json({
      success: true,
      id: result[0].id,
      created_at: result[0].created_at
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}
