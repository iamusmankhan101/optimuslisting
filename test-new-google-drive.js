// Test script for the new Google Drive upload URL
// Run this to verify the new Google Apps Script is working

const NEW_GOOGLE_DRIVE_URL = 'https://script.google.com/macros/s/AKfycbz5oOecP0QWQScrLSRIkgn24_fSqxcTspxR3ht8WleV6-ofl27qc9tz0eg34yBCoUfpgQ/exec';

async function testNewGoogleDriveScript() {
    console.log('🧪 Testing New Google Drive Script...');
    console.log('URL:', NEW_GOOGLE_DRIVE_URL);
    
    // Test 1: GET request to check if script is running
    console.log('\n=== TEST 1: GET Request (Health Check) ===');
    try {
        const getResponse = await fetch(NEW_GOOGLE_DRIVE_URL, {
            method: 'GET'
        });
        
        console.log('GET Status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('GET Response:', getText);
        
        try {
            const getJson = JSON.parse(getText);
            if (getJson.status === 'ok') {
                console.log('✅ GET Test: Script is running correctly');
            } else {
                console.log('⚠️ GET Test: Unexpected response');
            }
        } catch (parseError) {
            console.log('❌ GET Test: Response is not valid JSON');
        }
        
    } catch (error) {
        console.log('❌ GET Test Failed:', error.message);
    }
    
    // Test 2: POST request with test data
    console.log('\n=== TEST 2: POST Request (File Upload Test) ===');
    
    // Create minimal test data
    const testData = {
        property_code: `TEST-${Date.now()}`,
        property_images: [],
        documents: []
    };
    
    try {
        console.log('Sending test data:', testData);
        
        const postResponse = await fetch(NEW_GOOGLE_DRIVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('POST Status:', postResponse.status);
        const postText = await postResponse.text();
        console.log('POST Response (first 500 chars):', postText.substring(0, 500));
        
        try {
            const postJson = JSON.parse(postText);
            console.log('Parsed POST Response:', JSON.stringify(postJson, null, 2));
            
            if (postJson.success) {
                console.log('✅ POST Test: Folder creation successful!');
                console.log('Folder URL:', postJson.folderUrl);
                console.log('Folder ID:', postJson.folderId);
            } else {
                console.log('❌ POST Test: Failed -', postJson.error);
            }
            
        } catch (parseError) {
            console.log('❌ POST Test: Response is not valid JSON');
            console.log('This might indicate an authorization issue or script error');
        }
        
    } catch (error) {
        console.log('❌ POST Test Failed:', error.message);
    }
    
    // Test 3: POST request with actual file data
    console.log('\n=== TEST 3: POST Request with File Data ===');
    
    const testFileData = {
        property_code: `FILE-TEST-${Date.now()}`,
        property_images: [{
            name: 'test-image.png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
            mimeType: 'image/png',
            size: 95
        }],
        documents: [{
            name: 'test-document.txt',
            data: btoa('This is a test document for Google Drive upload verification.'),
            mimeType: 'text/plain',
            size: 58
        }]
    };
    
    try {
        console.log('Sending file test data...');
        console.log('Property code:', testFileData.property_code);
        console.log('Images:', testFileData.property_images.length);
        console.log('Documents:', testFileData.documents.length);
        
        const fileResponse = await fetch(NEW_GOOGLE_DRIVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testFileData)
        });
        
        console.log('File Test Status:', fileResponse.status);
        const fileText = await fileResponse.text();
        
        try {
            const fileJson = JSON.parse(fileText);
            console.log('File Test Response:', JSON.stringify(fileJson, null, 2));
            
            if (fileJson.success) {
                console.log('✅ File Upload Test: SUCCESS!');
                console.log('Files uploaded:', fileJson.files?.length || 0);
                console.log('Folder URL:', fileJson.folderUrl);
                
                if (fileJson.files && fileJson.files.length > 0) {
                    console.log('Uploaded files:');
                    fileJson.files.forEach((file, index) => {
                        console.log(`  ${index + 1}. ${file.name} (${file.type}) - ${file.url}`);
                    });
                }
            } else {
                console.log('❌ File Upload Test: Failed -', fileJson.error);
            }
            
        } catch (parseError) {
            console.log('❌ File Test: Response is not valid JSON');
            console.log('Raw response:', fileText.substring(0, 1000));
        }
        
    } catch (error) {
        console.log('❌ File Upload Test Failed:', error.message);
    }
    
    console.log('\n🏁 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- If all tests show ✅, your Google Drive integration is working correctly');
    console.log('- If you see ❌, check the Google Apps Script logs for detailed error information');
    console.log('- Make sure the script is deployed as a web app with "Anyone" access');
    console.log('- Verify the folder ID in the script matches your Google Drive folder');
}

// Run the test
if (typeof window !== 'undefined') {
    // Browser environment
    window.testNewGoogleDriveScript = testNewGoogleDriveScript;
    console.log('Test function available: testNewGoogleDriveScript()');
} else {
    // Node.js environment
    testNewGoogleDriveScript().catch(console.error);
}