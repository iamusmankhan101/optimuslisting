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

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, ids } = req.body;

  if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
    return res.status(400).json({ error: 'Property listing ID(s) required' });
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();

    let result;
    
    if (ids && ids.length > 0) {
      // Delete multiple listings
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const query = `DELETE FROM property_listings WHERE id IN (${placeholders}) RETURNING id`;
      result = await client.query(query, ids);
    } else {
      // Delete single listing
      const query = 'DELETE FROM property_listings WHERE id = $1 RETURNING id';
      result = await client.query(query, [id]);
    }

    client.release();
    pool.end();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Property listing(s) not found' });
    }

    res.json({
      success: true,
      deleted: result.rowCount,
      message: `Successfully deleted ${result.rowCount} property listing(s)`
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete property listing(s)' });
  }
}
