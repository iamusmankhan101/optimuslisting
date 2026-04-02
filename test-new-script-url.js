// Test the new Google Apps Script URL
// Run this to verify the updated script is working correctly

const NEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBelkvTugGyu81fO3mRMIsN-yIte4ratDNmTyg-8Xy8BcvtQyWSKQa-1mMgWoL1mGeNQ/exec';

async function testNewScriptURL() {
    console.log('🧪 Testing New Google Apps Script URL...');
    console.log('URL:', NEW_SCRIPT_URL);
    
    // Test 1: GET request (health check)
    console.log('\n=== TEST 1: GET Request (Health Check) ===');
    try {
        const getResponse = await fetch(NEW_SCRIPT_URL, {
            method: 'GET'
        });
        
        console.log('GET Status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('GET Response:', getText);
        
        try {
            const getJson = JSON.parse(getText);
            if (getJson.status === 'ok') {
                console.log('✅ GET Test: Script is running correctly');
                console.log('Message:', getJson.message);
            } else {
                console.log('⚠️ GET Test: Unexpected response');
            }
        } catch (parseError) {
            console.log('❌ GET Test: Response is not valid JSON');
            console.log('This might indicate the script has errors');
        }
        
    } catch (error) {
        console.log('❌ GET Test Failed:', error.message);
    }
    
    // Test 2: POST request with minimal data
    console.log('\n=== TEST 2: POST Request (Folder Creation Test) ===');
    
    const testData = {
        property_code: `SCRIPT-TEST-${Date.now()}`,
        property_images: [],
        documents: []
    };
    
    try {
        console.log('Sending test data:', testData);
        
        const postResponse = await fetch(NEW_SCRIPT_URL, {
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
                console.log('✅ POST Test: SUCCESS! Folder creation working');
                console.log('Folder URL:', postJson.folderUrl);
                console.log('Folder ID:', postJson.folderId);
                console.log('Files uploaded:', postJson.files?.length || 0);
            } else {
                console.log('❌ POST Test: Failed -', postJson.error);
                
                // Check for specific error types
                if (postJson.error.includes('setHeader')) {
                    console.log('🚨 CRITICAL: Script still has the old setHeader error!');
                    console.log('You need to replace the script code completely.');
                } else if (postJson.error.includes('Property code')) {
                    console.log('ℹ️ Property code validation working correctly');
                } else if (postJson.error.includes('folder')) {
                    console.log('⚠️ Folder access issue - check folder ID and permissions');
                }
            }
            
        } catch (parseError) {
            console.log('❌ POST Test: Response is not valid JSON');
            console.log('Raw response:', postText);
            
            if (postText.includes('setHeader is not a function')) {
                console.log('🚨 CRITICAL: The script still has the old broken code!');
                console.log('You must replace ALL the code in Google Apps Script.');
            } else if (postText.includes('Authorization required')) {
                console.log('🔐 Authorization needed - run the script in Google Apps Script editor first');
            }
        }
        
    } catch (error) {
        console.log('❌ POST Test Failed:', error.message);
    }
    
    // Test 3: POST with actual file data (small test)
    console.log('\n=== TEST 3: POST with Small File Data ===');
    
    const fileTestData = {
        property_code: `FILE-TEST-${Date.now()}`,
        property_images: [{
            name: 'test-tiny.png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
            mimeType: 'image/png',
            size: 95
        }],
        documents: []
    };
    
    try {
        console.log('Testing with small file...');
        
        const fileResponse = await fetch(NEW_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileTestData)
        });
        
        console.log('File Test Status:', fileResponse.status);
        const fileText = await fileResponse.text();
        
        try {
            const fileJson = JSON.parse(fileText);
            
            if (fileJson.success) {
                console.log('✅ File Upload Test: SUCCESS!');
                console.log('Files uploaded:', fileJson.files?.length || 0);
                console.log('Folder URL:', fileJson.folderUrl);
                
                if (fileJson.files && fileJson.files.length > 0) {
                    console.log('Uploaded files:');
                    fileJson.files.forEach((file, index) => {
                        console.log(`  ${index + 1}. ${file.name} (${file.type})`);
                    });
                }
            } else {
                console.log('❌ File Upload Test: Failed -', fileJson.error);
            }
            
        } catch (parseError) {
            console.log('❌ File Test: Response is not valid JSON');
            console.log('Raw response (first 1000 chars):', fileText.substring(0, 1000));
        }
        
    } catch (error) {
        console.log('❌ File Upload Test Failed:', error.message);
    }
    
    console.log('\n🏁 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- If you see ✅ for all tests, your Google Drive integration is working!');
    console.log('- If you see ❌ or setHeader errors, the script code needs to be updated');
    console.log('- Check your Google Drive folder for new test folders');
}

// Run the test
if (typeof window !== 'undefined') {
    // Browser environment
    window.testNewScriptURL = testNewScriptURL;
    console.log('Test function available: testNewScriptURL()');
} else {
    // Node.js environment
    testNewScriptURL().catch(console.error);
}