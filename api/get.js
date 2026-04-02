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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search, sortBy = 'created_at', order = 'DESC' } = req.query;

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();

    let query = 'SELECT * FROM property_listings';
    const params = [];

    if (search) {
      const searchTerm = `%${search}%`;
      query += ` WHERE property_code ILIKE $1 OR emirate ILIKE $1 OR area_community ILIKE $1 
                 OR building_name ILIKE $1 OR agent_name ILIKE $1 OR email ILIKE $1`;
      params.push(searchTerm);
    }

    const allowedSort = ['id', 'email', 'created_at', 'emirate', 'property_code'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await client.query(query, params);
    client.release();
    pool.end();

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
