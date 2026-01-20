// Debug script for Google Drive upload issues
// Run this to test the Google Drive upload functionality

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function testGoogleDriveUpload() {
    console.log('🧪 Testing Google Drive Upload...');
    console.log('API Base:', API_BASE);
    
    // Create test files (small base64 encoded files)
    const testImage = {
        name: 'test-image.png',
        data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
        mimeType: 'image/png',
        size: 95
    };
    
    const testDoc = {
        name: 'test-document.txt',
        data: btoa('This is a test document for Google Drive upload.'), // Base64 encoded text
        mimeType: 'text/plain',
        size: 45
    };
    
    const testData = {
        property_code: `TEST-${Date.now()}`,
        property_images: [testImage],
        documents: [testDoc]
    };
    
    console.log('Test data prepared:', {
        property_code: testData.property_code,
        images: testData.property_images.length,
        documents: testData.documents.length
    });
    
    try {
        console.log('📤 Sending request to upload-drive endpoint...');
        
        const response = await fetch(`${API_BASE}/upload-drive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📥 Response received:');
        console.log('Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        try {
            const data = JSON.parse(responseText);
            console.log('Parsed response:', JSON.stringify(data, null, 2));
            
            if (data.success) {
                console.log('✅ SUCCESS! Google Drive upload working correctly');
                console.log('Folder URL:', data.folderUrl);
                console.log('Files uploaded:', data.files?.length || 0);
                
                if (data.files && data.files.length > 0) {
                    console.log('Uploaded files:');
                    data.files.forEach((file, index) => {
                        console.log(`  ${index + 1}. ${file.name} (${file.type}) - ${file.url}`);
                    });
                }
            } else {
                console.log('❌ FAILURE! Google Drive upload failed');
                console.log('Error:', data.error);
                if (data.debug) {
                    console.log('Debug info:', data.debug);
                }
            }
        } catch (parseError) {
            console.log('❌ JSON Parse Error:', parseError.message);
            console.log('This usually means the Google Apps Script returned HTML instead of JSON');
            console.log('Check if the script is properly deployed and authorized');
        }
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('This could be a CORS issue, network problem, or server not running');
    }
}

// Test different scenarios
async function runAllTests() {
    console.log('🚀 Starting Google Drive Upload Debug Tests\n');
    
    // Test 1: Normal upload
    console.log('=== TEST 1: Normal Upload ===');
    await testGoogleDriveUpload();
    
    console.log('\n=== TEST 2: Empty Property Code ===');
    try {
        const response = await fetch(`${API_BASE}/upload-drive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                property_code: '',
                property_images: [],
                documents: []
            })
        });
        const data = await response.json();
        console.log('Empty property code result:', data);
    } catch (error) {
        console.log('Empty property code error:', error.message);
    }
    
    console.log('\n=== TEST 3: Large File Test ===');
    // Create a larger test file (but still reasonable)
    const largeData = 'A'.repeat(1000); // 1KB of data
    try {
        const response = await fetch(`${API_BASE}/upload-drive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                property_code: `LARGE-TEST-${Date.now()}`,
                property_images: [{
                    name: 'large-test.txt',
                    data: btoa(largeData),
                    mimeType: 'text/plain',
                    size: largeData.length
                }],
                documents: []
            })
        });
        const data = await response.json();
        console.log('Large file test result:', data.success ? '✅ Success' : '❌ Failed');
        if (!data.success) console.log('Error:', data.error);
    } catch (error) {
        console.log('Large file test error:', error.message);
    }
    
    console.log('\n🏁 All tests completed!');
}

// Run the tests
if (typeof window !== 'undefined') {
    // Browser environment
    window.testGoogleDriveUpload = testGoogleDriveUpload;
    window.runAllTests = runAllTests;
    console.log('Test functions available: testGoogleDriveUpload(), runAllTests()');
} else {
    // Node.js environment
    runAllTests().catch(console.error);
}