// Test the new Google Apps Script deployment URL
// URL: https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec

const GOOGLE_DRIVE_URL = 'https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec';

async function testNewDeployment() {
  console.log('🧪 Testing new Google Apps Script deployment...');
  console.log('URL:', GOOGLE_DRIVE_URL);
  
  try {
    // Test GET request first
    console.log('\n1. Testing GET request...');
    const getResponse = await fetch(GOOGLE_DRIVE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('GET Status:', getResponse.status);
    const getResult = await getResponse.text();
    console.log('GET Response:', getResult);
    
    // Test POST request with minimal data
    console.log('\n2. Testing POST request...');
    const testData = {
      property_code: 'TEST-NEW-DEPLOYMENT-' + Date.now(),
      property_images: [],
      documents: []
    };
    
    const postResponse = await fetch(GOOGLE_DRIVE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('POST Status:', postResponse.status);
    const postResult = await postResponse.text();
    console.log('POST Response:', postResult);
    
    // Try to parse as JSON
    try {
      const jsonResult = JSON.parse(postResult);
      console.log('\n✅ Parsed JSON Response:');
      console.log('- Success:', jsonResult.success);
      console.log('- Message:', jsonResult.message);
      if (jsonResult.folderUrl) {
        console.log('- Folder URL:', jsonResult.folderUrl);
      }
      if (jsonResult.debug) {
        console.log('- Execution Time:', jsonResult.debug.executionTimeSeconds + 's');
      }
    } catch (parseError) {
      console.log('⚠️ Could not parse as JSON, raw response above');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testNewDeployment();