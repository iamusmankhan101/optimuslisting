export default function handler(req, res) {
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

  // Initialize global listings if not exists
  if (!global.listings) {
    global.listings = [];
  }

  let results = [...global.listings];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(item =>
      (item.property_code && item.property_code.toLowerCase().includes(searchLower)) ||
      (item.emirate && item.emirate.toLowerCase().includes(searchLower)) ||
      (item.area_community && item.area_community.toLowerCase().includes(searchLower)) ||
      (item.building_name && item.building_name.toLowerCase().includes(searchLower)) ||
      (item.agent_name && item.agent_name.toLowerCase().includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower))
    );
  }

  // Sorting
  const allowedSort = ['id', 'name', 'email', 'created_at'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 1 : -1;

  results.sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    return aVal < bVal ? -sortOrder : aVal > bVal ? sortOrder : 0;
  });

  res.json({ success: true, data: results });
}
