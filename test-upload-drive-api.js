// Test the upload-drive API endpoint to debug the 500 error
const API_URL = 'https://listing.theoptimus.ae/api/upload-drive';

async function testUploadDriveAPI() {
  console.log('🧪 Testing upload-drive API endpoint...');
  console.log('URL:', API_URL);
  
  try {
    // Test with minimal data first
    const testData = {
      property_code: 'API-TEST-' + Date.now(),
      property_images: [],
      documents: []
    };
    
    console.log('\n📤 Sending test request...');
    console.log('Payload:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📥 Response received:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response length:', responseText.length, 'bytes');
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('\n✅ Parsed JSON Response:');
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.success) {
        console.log('🎉 API test successful!');
      } else {
        console.log('❌ API returned error:', jsonResponse.error);
        if (jsonResponse.details) {
          console.log('Details:', jsonResponse.details);
        }
        if (jsonResponse.hint) {
          console.log('Hint:', jsonResponse.hint);
        }
      }
      
    } catch (parseError) {
      console.log('⚠️ Could not parse as JSON');
      console.log('Raw response (first 1000 chars):');
      console.log(responseText.substring(0, 1000));
      
      if (responseText.includes('<!DOCTYPE html>')) {
        console.log('🔍 Response appears to be HTML - likely an error page');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testUploadDriveAPI();