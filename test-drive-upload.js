import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function testDriveUpload() {
  console.log('🧪 Testing Google Drive Upload...\n');

  const driveUrl = process.env.REACT_APP_GOOGLE_DRIVE_UPLOAD_URL;
  
  if (!driveUrl) {
    console.error('❌ REACT_APP_GOOGLE_DRIVE_UPLOAD_URL not found in environment variables');
    return;
  }

  console.log('📍 Drive Upload URL:', driveUrl);
  console.log('\n📤 Sending test data...\n');

  // Create a simple test file in base64
  const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  const testData = {
    property_code: 'TEST-DRIVE-001',
    property_images: [
      {
        name: 'test-image.png',
        data: testImageData,
        mimeType: 'image/png',
        size: 95
      }
    ],
    documents: [
      {
        name: 'test-document.txt',
        data: Buffer.from('This is a test document').toString('base64'),
        mimeType: 'text/plain',
        size: 23
      }
    ]
  };

  try {
    console.log('Sending request to:', driveUrl);
    console.log('Payload:', JSON.stringify({
      property_code: testData.property_code,
      property_images: testData.property_images.length + ' files',
      documents: testData.documents.length + ' files'
    }));

    const response = await fetch(driveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📊 Response Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      if (data.success) {
        console.log('\n✅ Upload successful!');
        console.log('📁 Folder URL:', data.folderUrl);
        console.log('📎 Files uploaded:', data.files.length);
        data.files.forEach(file => {
          console.log(`   - ${file.name} (${file.type}): ${file.url}`);
        });
        console.log('\n🎉 Check your Google Drive folder!');
      } else {
        console.log('\n❌ Upload failed:', data.error);
      }
    } else {
      console.log('\n❌ HTTP Error:', response.status);
      console.log('Response:', responseText.substring(0, 500));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if the Apps Script is deployed');
    console.log('   2. Verify the deployment URL is correct');
    console.log('   3. Ensure "Who has access" is set to "Anyone"');
    console.log('   4. Check Apps Script execution logs');
  }
}

testDriveUpload();
