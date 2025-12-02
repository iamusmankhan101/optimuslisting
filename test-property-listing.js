// Test Property Listing to Google Sheets
const https = require('https');

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxuttGUBC6ImQ-1ALYdSaNmhZeSx6DxbrxilnsO0hJyAzaBGOGrL_M7H21CpkN_JLHICQ/exec';

const testPropertyListing = {
  sheet: 'PropertyListings',
  data: {
    id: 'PROP-' + Date.now(),
    email: 'agent@example.com',
    source_of_listing: 'Direct',
    category: 'Residential',
    sub_category: 'Apartment',
    purpose: 'Rent',
    property_code: 'DXB-APT-' + Date.now(),
    emirate: 'Dubai',
    area_community: 'Dubai Marina',
    building_name: 'Marina Heights Tower',
    unit_number: '1205',
    bedrooms: '2',
    bathrooms: '2',
    size_sqft: '1200',
    maid_room: 'No',
    furnishing: 'Furnished',
    property_condition: 'Excellent',
    sale_price: '',
    unit_status: 'Vacant',
    asking_rent: '85000',
    number_of_chq: '4',
    keys_status: 'Available',
    viewing_status: 'Available',
    agent_name: 'John Smith',
    agent_mobile: '+971501234567',
    agent_email: 'john@agency.com'
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

    console.log('📤 Sending property listing to Google Sheets...');
    console.log('Property Details:');
    console.log('  Property Code:', data.data.property_code);
    console.log('  Type:', data.data.sub_category);
    console.log('  Location:', data.data.area_community + ', ' + data.data.emirate);
    console.log('  Bedrooms:', data.data.bedrooms);
    console.log('  Rent:', 'AED ' + data.data.asking_rent);
    console.log('  Agent:', data.data.agent_name);
    console.log('');

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('✅ Response Status:', res.statusCode);
        
        if (res.statusCode === 302 || res.statusCode === 200) {
          console.log('✅ SUCCESS! Property listing sent to Google Sheets');
          console.log('');
          console.log('📊 Check your Google Sheets:');
          console.log('https://docs.google.com/spreadsheets/d/1KWlcys7Wc7ujoBntQeriPWI20fX-s7jwn_IXNF7zpFw/edit');
          console.log('');
          console.log('Look for the "PropertyListings" sheet tab');
        } else {
          console.log('⚠️  Unexpected status code:', res.statusCode);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ ERROR:', error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Testing Property Listing to Google Sheets');
  console.log('='.repeat(60));
  console.log('');

  try {
    await sendToGoogleSheets(testPropertyListing);
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Test completed!');
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ Test failed:', error.message);
  }
}

main();
