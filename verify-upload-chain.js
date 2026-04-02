require('dotenv').config({ path: '.env.development.local' });
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyUploadChain() {
  const url = process.env.GOOGLE_DRIVE_UPLOAD_URL;
  console.log('🔍 Testing Google Apps Script URL from environment:');
  console.log('URL:', url);
  
  if (!url) {
    console.error('❌ GOOGLE_DRIVE_UPLOAD_URL is not set in .env.development.local');
    process.exit(1);
  }

  try {
    console.log('\n--- Test 1: GET (Health Check) ---');
    const getResp = await fetch(url);
    console.log('Status:', getResp.status);
    const getText = await getResp.text();
    console.log('Response:', getText);
    
    if (getText.includes('status') && getText.includes('ok')) {
      console.log('✅ GET Test: SUCCESS');
    } else {
      console.log('❌ GET Test: FAILED (Unexpected response)');
    }

    console.log('\n--- Test 2: POST (Folder Creation) ---');
    const testData = {
      property_code: 'VERIFY-TEST-' + new Date().toISOString().replace(/[:.]/g, '-'),
      property_images: [],
      documents: []
    };
    
    const postResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log('Status:', postResp.status);
    const postText = await postResp.text();
    
    try {
      const postJson = JSON.parse(postText);
      if (postJson.success) {
        console.log('✅ POST Test: SUCCESS');
        console.log('Folder URL:', postJson.folderUrl);
        console.log('Folder ID:', postJson.folderId);
      } else {
        console.log('❌ POST Test: FAILED -', postJson.error);
        if (postText.includes('setHeader')) {
          console.log('🚨 HINT: The script still has the broken ".setHeader()" code.');
        }
      }
    } catch (e) {
      console.log('❌ POST Test: FAILED (Response is not JSON)');
      console.log('Raw response snapshot:', postText.substring(0, 500));
      
      if (postText.includes('Sorry, unable to open the file at present')) {
        console.log('🚨 HINT: This is a Google system error. It usually means the script is locked or the URL is slightly wrong.');
      } else if (postText.includes('Authorization required')) {
        console.log('🚨 HINT: The script needs authorization. Run it once in the Google Apps Script editor.');
      }
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyUploadChain();
