// Send Test Buyer Lead to Google Sheets
const https = require('https');

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxuttGUBC6ImQ-1ALYdSaNmhZeSx6DxbrxilnsO0hJyAzaBGOGrL_M7H21CpkN_JLHICQ/exec';

// Test Buyer Lead
const testBuyerLead = {
  sheet: 'BuyerRequirements',
  data: {
    id: 'BUYER-' + Date.now(),
    name: 'Ahmed Al Mansouri',
    email: 'ahmed.mansouri@example.com',
    phone: '+971501234567',
    purpose: 'Buy',
    category: 'Residential',
    sub_category: 'Villa',
    emirate: 'Dubai',
    preferred_areas: 'Arabian Ranches, Dubai Hills Estate, Jumeirah Golf Estates',
    bedrooms: '4',
    bathrooms: '4',
    min_size_sqft: '3500',
    max_size_sqft: '5000',
    maid_room: 'Yes',
    furnishing: 'Unfurnished',
    min_budget: '4000000',
    max_budget: '6000000',
    payment_method: 'Mortgage',
    additional_requirements: 'Looking for a family villa with garden, pool access, and close to good schools. Prefer corner plot with extra privacy.'
  }
};

function sendToGoogleSheets(data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    
    const url = new URL(GOOGLE_SHEETS_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };

    console.log('📤 Sending buyer lead to Google Sheets...');
    console.log('Lead Details:');
    console.log('  Name:', data.data.name);
    console.log('  Email:', data.data.email);
    console.log('  Phone:', data.data.phone);
    console.log('  Purpose:', data.data.purpose);
    console.log('  Property Type:', data.data.sub_category);
    console.log('  Location:', data.data.emirate);
    console.log('  Bedrooms:', data.data.bedrooms);
    console.log('  Budget:', `AED ${data.data.min_budget} - ${data.data.max_budget}`);
    console.log('');

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('✅ Response Status:', res.statusCode);
        
        if (res.statusCode === 302 || res.statusCode === 200) {
          console.log('✅ SUCCESS! Buyer lead sent to Google Sheets');
          console.log('');
          console.log('📊 Check your Google Sheets:');
          console.log('https://docs.google.com/spreadsheets/d/1KWlcys7Wc7ujoBntQeriPWI20fX-s7jwn_IXNF7zpFw/edit');
          console.log('');
          console.log('Look for the "BuyerRequirements" sheet tab');
          console.log('The new lead should appear at the bottom of the sheet');
        } else {
          console.log('⚠️  Unexpected status code:', res.statusCode);
          console.log('Response:', responseData.substring(0, 500));
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ ERROR sending to Google Sheets:', error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Sending Test Buyer Lead to Google Sheets');
  console.log('='.repeat(60));
  console.log('');

  try {
    await sendToGoogleSheets(testBuyerLead);
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ Test failed:', error.message);
  }
}

main();
