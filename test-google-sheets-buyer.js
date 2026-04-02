// Test Google Sheets deployment for Buyer Requirements
const https = require('https');

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxIpDs35waH7FdNkiCeP7DK-cy7z_c1VKjjxX_KBRcQIbNh91KXQFJ2IZ6YWzsGAWr5LA/exec';

// Test 1: Property Listing
const testPropertyListing = {
  sheet: 'PropertyListings',
  data: {
    id: 'TEST-PROP-001',
    email: 'agent@test.com',
    source_of_listing: 'Direct',
    category: 'Residential',
    sub_category: 'Apartment',
    purpose: 'Rent',
    property_code: 'DXB-APT-001',
    emirate: 'Dubai',
    area_community: 'Dubai Marina',
    building_name: 'Marina Heights',
    unit_number: '1205',
    bedrooms: '2',
    bathrooms: '2',
    size_sqft: '1200',
    maid_room: 'No',
    furnishing: 'Furnished',
    property_condition: 'Excellent',
    asking_rent: '85000',
    number_of_chq: '4',
    keys_status: 'Available',
    viewing_status: 'Available',
    agent_name: 'Test Agent',
    agent_mobile: '+971501234567',
    agent_email: 'agent@test.com'
  }
};

// Test 2: Buyer Requirements
const testBuyerRequirements = {
  sheet: 'BuyerRequirements',
  data: {
    id: 'TEST-BUYER-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+971509876543',
    purpose: 'Buy',
    category: 'Residential',
    sub_category: 'Villa',
    emirate: 'Dubai',
    preferred_areas: 'Arabian Ranches, Dubai Hills',
    bedrooms: '4',
    bathrooms: '3',
    min_size_sqft: '3000',
    max_size_sqft: '4000',
    maid_room: 'Yes',
    furnishing: 'Unfurnished',
    min_budget: '3000000',
    max_budget: '4000000',
    payment_method: 'Cash',
    additional_requirements: 'Must have garden and pool access'
  }
};

function testGoogleSheets(testData, testName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(testData);
    
    const url = new URL(GOOGLE_SHEETS_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    console.log(`\n🧪 Testing: ${testName}`);
    console.log('Sending data:', JSON.stringify(testData, null, 2));

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`\n✅ Response Status: ${res.statusCode}`);
        console.log('Response:', responseData);
        
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success) {
            console.log(`✅ ${testName} - SUCCESS!`);
          } else {
            console.log(`❌ ${testName} - FAILED:`, parsed.error);
          }
        } catch (e) {
          console.log('Response (not JSON):', responseData);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${testName} - ERROR:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Google Sheets Deployment');
  console.log('URL:', GOOGLE_SHEETS_URL);
  console.log('='.repeat(60));

  try {
    await testGoogleSheets(testPropertyListing, 'Property Listing');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await testGoogleSheets(testBuyerRequirements, 'Buyer Requirements');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('\n📊 Check your Google Sheets:');
    console.log('https://docs.google.com/spreadsheets/d/1KWlcys7Wc7ujoBntQeriPWI20fX-s7jwn_IXNF7zpFw/edit');
    console.log('\nYou should see:');
    console.log('- PropertyListings sheet with test property');
    console.log('- BuyerRequirements sheet with test buyer');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

runTests();
