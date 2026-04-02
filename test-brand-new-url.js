// Test the BRAND NEW deployment URL
const BRAND_NEW_URL = 'https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec';

async function testBrandNewURL() {
    console.log('🎉 Testing BRAND NEW Google Apps Script URL...');
    console.log('URL:', BRAND_NEW_URL);
    
    // Test 1: GET request
    console.log('\n=== TEST 1: GET Request ===');
    try {
        const getResponse = await fetch(BRAND_NEW_URL, {
            method: 'GET'
        });
        
        console.log('GET Status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('GET Response:', getText);
        
        try {
            const getJson = JSON.parse(getText);
            if (getJson.status === 'ok') {
                console.log('✅ GET Test: SUCCESS! New deployment is working');
                console.log('Message:', getJson.message);
            }
        } catch (parseError) {
            console.log('❌ GET Test: Response is not valid JSON');
            if (getText.includes('setHeader')) {
                console.log('🚨 STILL HAS setHeader ERROR!');
            }
        }
        
    } catch (error) {
        console.log('❌ GET Test Failed:', error.message);
    }
    
    // Test 2: POST request with file upload
    console.log('\n=== TEST 2: POST Request with Files ===');
    
    const testData = {
        property_code: `NEW-DEPLOY-${Date.now()}`,
        property_images: [{
            name: 'test-new-deploy.png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            mimeType: 'image/png',
            size: 95
        }],
        documents: [{
            name: 'test-new-deploy.txt',
            data: btoa('This is a test document for the new deployment URL.'),
            mimeType: 'text/plain',
            size: 50
        }]
    };
    
    try {
        console.log('Sending test data to new deployment...');
        console.log('Property code:', testData.property_code);
        console.log('Files to upload:', testData.property_images.length + testData.documents.length);
        
        const postResponse = await fetch(BRAND_NEW_URL, {
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
                console.log('🎉 AMAZING! New deployment works perfectly!');
                console.log('✅ Folder created:', postJson.folderUrl);
                console.log('✅ Files uploaded:', postJson.files?.length || 0);
                console.log('✅ Execution time:', postJson.debug?.executionTimeSeconds + 's');
                
                console.log('\n🚀 YOUR FORM SHOULD NOW WORK!');
                console.log('Restart your application and try uploading files.');
                
            } else {
                console.log('❌ POST Test Failed:', postJson.error);
                
                if (postJson.error.includes('setHeader')) {
                    console.log('🚨 CRITICAL: New deployment still has setHeader error!');
                }
            }
            
        } catch (parseError) {
            console.log('❌ POST Test: Response is not valid JSON');
            console.log('Raw response:', postText.substring(0, 1000));
            
            if (postText.includes('setHeader is not a function')) {
                console.log('🚨 CRITICAL: New deployment still has the old code!');
            }
        }
        
    } catch (error) {
        console.log('❌ POST Test Failed:', error.message);
    }
    
    console.log('\n🏁 Test completed!');
}

testBrandNewURL();