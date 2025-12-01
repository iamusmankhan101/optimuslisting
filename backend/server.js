import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 8001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with database later)
let listings = [];
let nextId = 1;

// GET endpoint - retrieve listings with optional search and sorting
app.get('/get', (req, res) => {
  const { search, sortBy = 'created_at', order = 'DESC' } = req.query;
  
  let results = [...listings];
  
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
});

// POST endpoint - submit new listing
app.post('/submit', async (req, res) => {
  const data = req.body;
  
  if (!data || !data.email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  const listing = {
    id: nextId++,
    ...data,
    created_at: new Date().toISOString()
  };
  
  listings.push(listing);
  
  // Send to Google Sheets
  try {
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      const response = await fetch(googleSheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      const result = await response.text();
      console.log('Google Sheets response:', result);
    } else {
      console.warn('GOOGLE_SHEET_WEBHOOK_URL not configured');
    }
  } catch (err) {
    console.error('Error syncing to Google Sheets:', err.message);
  }
  
  res.json({
    success: true,
    id: listing.id
  });
});

// Buyer requirements storage
let buyerRequirements = [];
let nextBuyerId = 1;

// POST endpoint - submit buyer requirements
app.post('/buyer-requirements', (req, res) => {
  const data = req.body;
  
  if (!data || !data.email || !data.name || !data.phone) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  const requirement = {
    id: nextBuyerId++,
    ...data,
    created_at: new Date().toISOString()
  };
  
  buyerRequirements.push(requirement);
  
  res.json({
    success: true,
    id: requirement.id,
    message: 'Buyer requirements submitted successfully'
  });
});

// GET endpoint - retrieve buyer requirements
app.get('/buyer-requirements', (req, res) => {
  res.json({ success: true, requirements: buyerRequirements });
});

// POST endpoint - match properties based on buyer requirements
app.post('/match-properties', (req, res) => {
  const { purpose, emirate, bedrooms, bathrooms, min_budget, max_budget } = req.body;
  
  let matches = [...listings];
  
  // Filter by emirate
  if (emirate) {
    matches = matches.filter(p => p.emirate === emirate);
  }
  
  // Filter by purpose
  if (purpose) {
    matches = matches.filter(p => p.purpose === purpose || p.purpose === 'Both');
  }
  
  // Filter by bedrooms (exact or higher)
  if (bedrooms && bedrooms !== 'Studio') {
    matches = matches.filter(p => {
      if (p.bedrooms === bedrooms || p.bedrooms === bedrooms + '+') return true;
      const pBed = parseInt(p.bedrooms);
      const reqBed = parseInt(bedrooms);
      return !isNaN(pBed) && !isNaN(reqBed) && pBed >= reqBed;
    });
  } else if (bedrooms === 'Studio') {
    matches = matches.filter(p => p.bedrooms === 'Studio');
  }
  
  // Filter by bathrooms (exact or higher)
  if (bathrooms) {
    matches = matches.filter(p => {
      if (p.bathrooms === bathrooms || p.bathrooms === bathrooms + '+') return true;
      const pBath = parseInt(p.bathrooms);
      const reqBath = parseInt(bathrooms);
      return !isNaN(pBath) && !isNaN(reqBath) && pBath >= reqBath;
    });
  }
  
  // Filter by budget
  if (min_budget && max_budget) {
    matches = matches.filter(p => {
      let price = 0;
      if (purpose === 'Buy' && p.sale_price) {
        price = parseInt(p.sale_price.replace(/[^0-9]/g, ''));
      } else if (purpose === 'Rent' && p.asking_rent) {
        price = parseInt(p.asking_rent.replace(/[^0-9]/g, ''));
      }
      return price >= parseInt(min_budget) && price <= parseInt(max_budget);
    });
  }
  
  res.json({
    success: true,
    matches: matches,
    count: matches.length
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
