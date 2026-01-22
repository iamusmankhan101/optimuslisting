// Fixed Google Apps Script for Property File Upload to Google Drive
// Copy this entire code and paste it into your Google Apps Script project

// Configuration - Your Google Drive Folder ID
const FOLDER_ID = '1mZHljfLGBsUeae3GzlCln3ZRgG509-IIn7F2VwxcLC7ykCtwgqJNoswUBa3FaCsm93qAHuRV';

// Handle GET requests
function doGet(e) {
  const response = {
    status: 'ok',
    message: 'Google Drive Upload API is running',
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests
function doPost(e) {
  try {
    console.log('=== GOOGLE APPS SCRIPT UPLOAD START ===');
    console.log('Request received at:', new Date().toISOString());
    
    // Parse request data
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received in request');
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Request data keys:', Object.keys(data));
    
    // Validate property code
    const propertyCode = data.property_code?.trim();
    if (!propertyCode || propertyCode === '' || propertyCode === 'NO_CODE') {
      throw new Error('Valid property code is required for folder creation');
    }
    console.log('Property code:', propertyCode);
    
    // Get main folder
    const mainFolder = DriveApp.getFolderById(FOLDER_ID);
    if (!mainFolder) {
      throw new Error('Main folder not found. Check FOLDER_ID configuration.');
    }
    
    // Create or get property subfolder
    let propertyFolder;
    const existingFolders = mainFolder.getFoldersByName(propertyCode);
    
    if (existingFolders.hasNext()) {
      propertyFolder = existingFolders.next();
      console.log('Using existing property folder:', propertyCode);
    } else {
      propertyFolder = mainFolder.createFolder(propertyCode);
      console.log('Created new property folder:', propertyCode);
      
      // Small delay to ensure folder is fully created
      Utilities.sleep(500);
    }
    
    const uploadedFiles = [];
    
    // Process property images
    if (data.property_images && Array.isArray(data.property_images) && data.property_images.length > 0) {
      console.log('Processing', data.property_images.length, 'property images...');
      
      // Create or get images subfolder
      let imagesFolder;
      const existingImagesFolders = propertyFolder.getFoldersByName('Property Images');
      
      if (existingImagesFolders.hasNext()) {
        imagesFolder = existingImagesFolders.next();
      } else {
        imagesFolder = propertyFolder.createFolder('Property Images');
        Utilities.sleep(200);
      }
      
      // Upload each image
      for (let i = 0; i < data.property_images.length; i++) {
        const fileData = data.property_images[i];
        
        try {
          console.log(`Processing image ${i + 1}/${data.property_images.length}: ${fileData.name}`);
          
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            console.log('Skipping invalid image data:', fileData.name);
            continue;
          }
          
          // Create blob from base64 data
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          // Create file in Drive
          const file = imagesFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'image',
            size: blob.getBytes().length
          });
          
          console.log(`✅ Image uploaded: ${fileData.name}`);
          
        } catch (imageError) {
          console.log(`❌ Failed to upload image ${fileData.name}:`, imageError.toString());
          // Continue with other files instead of failing completely
        }
      }
    }
    
    // Process documents
    if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
      console.log('Processing', data.documents.length, 'documents...');
      
      // Create or get documents subfolder
      let documentsFolder;
      const existingDocsFolders = propertyFolder.getFoldersByName('Documents');
      
      if (existingDocsFolders.hasNext()) {
        documentsFolder = existingDocsFolders.next();
      } else {
        documentsFolder = propertyFolder.createFolder('Documents');
        Utilities.sleep(200);
      }
      
      // Upload each document
      for (let i = 0; i < data.documents.length; i++) {
        const fileData = data.documents[i];
        
        try {
          console.log(`Processing document ${i + 1}/${data.documents.length}: ${fileData.name}`);
          
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            console.log('Skipping invalid document data:', fileData.name);
            continue;
          }
          
          // Create blob from base64 data
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          // Create file in Drive
          const file = documentsFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'document',
            size: blob.getBytes().length
          });
          
          console.log(`✅ Document uploaded: ${fileData.name}`);
          
        } catch (docError) {
          console.log(`❌ Failed to upload document ${fileData.name}:`, docError.toString());
          // Continue with other files instead of failing completely
        }
      }
    }
    
    // Prepare success response
    const response = {
      success: true,
      folderUrl: propertyFolder.getUrl(),
      folderId: propertyFolder.getId(),
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} files`,
      debug: {
        propertyCode: propertyCode,
        totalFilesUploaded: uploadedFiles.length,
        imagesCount: uploadedFiles.filter(f => f.type === 'image').length,
        documentsCount: uploadedFiles.filter(f => f.type === 'document').length,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('✅ Upload completed successfully!');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.log('❌ Error in doPost:', error.toString());
    console.log('Error stack:', error.stack);
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      debug: {
        timestamp: new Date().toISOString(),
        errorType: error.name || 'UnknownError'
      }
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - you can run this in the Apps Script editor to test
function testUpload() {
  console.log('Running test upload...');
  
  const testData = {
    property_code: 'TEST-' + Date.now(),
    property_images: [],
    documents: []
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
  
  return result.getContent();
}

// Function to check folder structure
function checkFolderStructure() {
  try {
    const mainFolder = DriveApp.getFolderById(FOLDER_ID);
    console.log('Main folder found:', mainFolder.getName());
    
    const subfolders = mainFolder.getFolders();
    let count = 0;
    
    console.log('Property folders:');
    while (subfolders.hasNext() && count < 10) {
      const folder = subfolders.next();
      console.log(`- ${folder.getName()} (${folder.getUrl()})`);
      count++;
    }
    
    return `Found ${count} property folders`;
    
  } catch (error) {
    console.log('Error checking folder structure:', error.toString());
    return 'Error: ' + error.toString();
  }
}