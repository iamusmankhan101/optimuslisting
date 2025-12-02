// Test Buyer Requirements API locally
const http = require('http');

const testData = {
  name: 'Test Buyer Local',
  email: 'testlocal@example.com',
  phone: '+971501234567',
  purpose: 'Buy',
  category: 'Residential',
  sub_category: 'Villa',
  emirate: 'Dubai',
  preferred_areas: 'Arabian Ranches',
  bedrooms: '4',
  bathrooms: '3',
  min_size_sqft: '3000',
  max_size_sqft: '4000',
  maid_room: 'Yes',
  furnishing: 'Unfurnished',
  min_budget: '3000000',
  max_budget: '4000000',
  payment_method: 'Cash',
  additional_requirements: 'Test from local'
};

const payload = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/buyer-requirements',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

console.log('🧪 Testing Buyer Requirements API locally...');
console.log('URL: http://localhost:3000/api/buyer-requirements');
console.log('');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('✅ SUCCESS! Buyer requirement submitted');
        console.log('ID:', parsed.id);
        console.log('Google Sheets Sync:', parsed.googleSheetsSync);
      } else {
        console.log('❌ FAILED:', parsed.error);
      }
    } catch (e) {
      console.log('⚠️  Response is not JSON (might be HTML error page)');
      console.log('First 200 chars:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ERROR:', error.message);
  console.log('');
  console.log('Make sure your development server is running!');
  console.log('If using Vercel dev: vercel dev');
  console.log('If using React: cd frontend && npm start');
});

req.write(payload);
req.end();
