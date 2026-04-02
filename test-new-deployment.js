// Test the new Google Apps Script deployment
const NEW_URL = 'https://script.google.com/macros/s/AKfycbzzL4lfYs11On7IMzGzm3WmMOs46WAd_FJX5uTjf288H-_cDQemhzU5m0kZ7sJCOmrRLg/exec';

async function testNewDeployment() {
  console.log('Testing new Google Apps Script deployment...');
  console.log('URL:', NEW_URL);
  
  try {
    // Test GET request
    console.log('\n1. Testing GET request...');
    const getResponse = await fetch(NEW_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('GET Status:', getResponse.status);
    const getResult = await getResponse.text();
    
    try {
      const getJson = JSON.parse(getResult);
      console.log('GET Response:', getJson);
      if (getJson.status === 'ok') {
        console.log('✅ GET request working!');
      }
    } catch (e) {
      console.log('GET Response (raw):', getResult.substring(0, 200));
    }
    
    // Test POST request
    console.log('\n2. Testing POST request...');
    const testData = {
      property_code: 'TEST-NEW-' + Date.now(),
      property_images: [],
      documents: []
    };
    
    const postResponse = await fetch(NEW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('POST Status:', postResponse.status);
    const postResult = await postResponse.text();
    
    try {
      const postJson = JSON.parse(postResult);
      console.log('POST Response:', postJson);
      if (postJson.success) {
        console.log('✅ POST request working!');
        console.log('Folder URL:', postJson.folderUrl);
      } else {
        console.log('❌ POST failed:', postJson.error);
      }
    } catch (e) {
      console.log('POST Response (raw):', postResult.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewDeployment();