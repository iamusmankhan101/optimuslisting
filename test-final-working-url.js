// Test the FINAL working Google Apps Script URL
// This should be the URL that works perfectly

const FINAL_WORKING_URL = 'https://script.google.com/macros/s/AKfycbxxVXHZ5XBWFbzcxW86RGKnbEUKjLz965c62goS7sMq_5cp9C6EH1Y6L4WKH2Fx_Z2NKw/exec';

async function testFinalWorkingURL() {
    console.log('🎯 Testing FINAL Working Google Apps Script URL...');
    console.log('URL:', FINAL_WORKING_URL);
    
    // Test 1: GET request (health check)
    console.log('\n=== TEST 1: GET Request (Health Check) ===');
    try {
        const getResponse = await fetch(FINAL_WORKING_URL, {
            method: 'GET'
        });
        
        console.log('GET Status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('GET Response:', getText);
        
        try {
            const getJson = JSON.parse(getText);
            if (getJson.status === 'ok' && getJson.message.includes('Optimized Version')) {
                console.log('✅ GET Test: PERFECT! Optimized script is running');
                console.log('Message:', getJson.message);
            } else {
                console.log('⚠️ GET Test: Unexpected response');
            }
        } catch (parseError) {
            console.log('❌ GET Test: Response is not valid JSON');
            if (getText.includes('setHeader')) {
                console.log('🚨 CRITICAL: This URL still has the old broken code!');
            }
        }
        
    } catch (error) {
        console.log('❌ GET Test Failed:', error.message);
    }
    
    // Test 2: POST request with test data
    console.log('\n=== TEST 2: POST Request (File Upload Test) ===');
    
    const testData = {
        property_code: `FINAL-TEST-${Date.now()}`,
        property_images: [{
            name: 'test-final.png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
            mimeType: 'image/png',
            size: 95
        }],
        documents: [{
            name: 'test-final.txt',
            data: btoa('This is the final test document to verify the working Google Apps Script.'),
            mimeType: 'text/plain',
            size: 70
        }]
    };
    
    try {
        console.log('Sending final test data...');
        console.log('Property code:', testData.property_code);
        console.log('Files to upload:', testData.property_images.length + testData.documents.length);
        
        const postResponse = await fetch(FINAL_WORKING_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('POST Status:', postResponse.status);
        const postText = await postResponse.text();
        
        try {
            const postJson = JSON.parse(postText);
            console.log('Parsed Response:', JSON.stringify(postJson, null, 2));
            
            if (postJson.success) {
                console.log('🎉 SUCCESS! Final URL is working perfectly!');
                console.log('✅ Folder created:', postJson.folderUrl);
                console.log('✅ Files uploaded:', postJson.files?.length || 0);
                console.log('✅ Execution time:', postJson.debug?.executionTimeSeconds + 's');
                
                if (postJson.files && postJson.files.length > 0) {
                    console.log('✅ Uploaded files:');
                    postJson.files.forEach((file, index) => {
                        console.log(`   ${index + 1}. ${file.name} (${file.type}) - ${file.url}`);
                    });
                }
                
                console.log('\n🎯 PERFECT! Your form should now work correctly!');
                
            } else {
                console.log('❌ POST Test Failed:', postJson.error);
                
                if (postJson.error.includes('setHeader')) {
                    console.log('🚨 CRITICAL: This URL still has the setHeader error!');
                    console.log('You may need to create a new deployment.');
                }
            }
            
        } catch (parseError) {
            console.log('❌ POST Test: Response is not valid JSON');
            console.log('Raw response (first 1000 chars):', postText.substring(0, 1000));
            
            if (postText.includes('setHeader is not a function')) {
                console.log('🚨 CRITICAL: This URL still points to broken code!');
            }
        }
        
    } catch (error) {
        console.log('❌ POST Test Failed:', error.message);
    }
    
    console.log('\n🏁 Final test completed!');
    console.log('\n📋 Summary:');
    console.log('- If you see 🎉 SUCCESS, your form uploads should work now');
    console.log('- If you see 🚨 CRITICAL errors, the URL still points to old code');
    console.log('- Restart your application after this test to pick up new environment variables');
}

// Run the test
if (typeof window !== 'undefined') {
    // Browser environment
    window.testFinalWorkingURL = testFinalWorkingURL;
    console.log('Test function available: testFinalWorkingURL()');
} else {
    // Node.js environment
    testFinalWorkingURL().catch(console.error);
}