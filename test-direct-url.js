// Test the URL directly to see what's happening
const TEST_URL = 'https://script.google.com/macros/s/AKfycbxxVXHZ5XBWFbzcxW86RGKnbEUKjLz965c62goS7sMq_5cp9C6EH1Y6L4WKH2Fx_Z2NKw/exec';

async function testDirectURL() {
    console.log('🔍 Testing URL directly:', TEST_URL);
    
    try {
        // Test GET request
        console.log('\n=== GET Request ===');
        const getResponse = await fetch(TEST_URL, {
            method: 'GET'
        });
        
        console.log('Status:', getResponse.status);
        const getText = await getResponse.text();
        console.log('Response:', getText);
        
        // Test POST request
        console.log('\n=== POST Request ===');
        const postData = {
            property_code: 'DIRECT-TEST-' + Date.now(),
            property_images: [],
            documents: []
        };
        
        const postResponse = await fetch(TEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        console.log('POST Status:', postResponse.status);
        const postText = await postResponse.text();
        console.log('POST Response:', postText);
        
        if (postText.includes('setHeader')) {
            console.log('🚨 FOUND THE PROBLEM: This URL still has setHeader error!');
        } else {
            console.log('✅ No setHeader error found');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testDirectURL();