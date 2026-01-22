// Test the Google Apps Script directly to confirm it's working
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec';

async function testDirectGoogleScript() {
  console.log('🧪 Testing Google Apps Script directly...');
  console.log('URL:', GOOGLE_SCRIPT_URL);
  
  try {
    // Test GET request first
    console.log('\n1. Testing GET request...');
    const getResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('GET Status:', getResponse.status);
    const getResult = await getResponse.text();
    
    if (getResult.includes('Script function not found')) {
      console.log('❌ GET: Script function not found - doGet missing');
    } else {
      console.log('✅ GET: Working');
      try {
        const getJson = JSON.parse(getResult);
        console.log('GET Response:', getJson.message);
      } catch (e) {
        console.log('GET Response (first 200 chars):', getResult.substring(0, 200));
      }
    }
    
    // Test POST request
    console.log('\n2. Testing POST request...');
    const testData = {
      property_code: 'DIRECT-TEST-' + Date.now(),
      property_images: [],
      documents: []
    };
    
    const postResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('POST Status:', postResponse.status);
    const postResult = await postResponse.text();
    
    if (postResult.includes('Script function not found')) {
      console.log('❌ POST: Script function not found - doPost missing');
      console.log('🔧 SOLUTION: You need to paste the optimized script into this Google Apps Script project');
    } else {
      console.log('✅ POST: Working');
      try {
        const postJson = JSON.parse(postResult);
        console.log('POST Response:', postJson.message);
        if (postJson.folderUrl) {
          console.log('Folder created:', postJson.folderUrl);
        }
      } catch (e) {
        console.log('POST Response (first 200 chars):', postResult.substring(0, 200));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDirectGoogleScript();