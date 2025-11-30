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

  // Initialize global listings if not exists
  if (!global.listings) {
    global.listings = [];
    global.nextId = 1;
  }

  const listing = {
    id: global.nextId++,
    ...data,
    created_at: new Date().toISOString()
  };

  global.listings.push(listing);

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
}
