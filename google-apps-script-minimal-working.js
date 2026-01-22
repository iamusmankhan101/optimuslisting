// MINIMAL WORKING Google Apps Script for Property File Upload
// Copy this ENTIRE code and replace ALL existing code in your Google Apps Script

const FOLDER_ID = '14HIhuxU7EXO_vfaVxaDWAEtBQiQzarBY';

function doGet(e) {
  const response = {
    status: 'ok',
    message: 'Google Drive Upload API is running - Minimal Version',
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    Logger.log('=== MINIMAL GOOGLE APPS SCRIPT START ===');
    
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received');
    }
    
    const data = JSON.parse(e.postData.contents);
    const propertyCode = data.property_code ? data.property_code.trim() : '';
    
    if (!propertyCode || propertyCode === '' || propertyCode === 'NO_CODE') {
      throw new Error('Property code is required');
    }
    
    Logger.log('Property code: ' + propertyCode);
    
    // Get main folder
    const mainFolder = DriveApp.getFolderById(FOLDER_ID);
    
    // Create or get property folder
    let propertyFolder;
    const existingFolders = mainFolder.getFoldersByName(propertyCode);
    
    if (existingFolders.hasNext()) {
      propertyFolder = existingFolders.next();
      Logger.log('Using existing folder');
    } else {
      propertyFolder = mainFolder.createFolder(propertyCode);
      Logger.log('Created new folder');
      Utilities.sleep(500);
    }
    
    const uploadedFiles = [];
    
    // Process images
    if (data.property_images && data.property_images.length > 0) {
      Logger.log('Processing ' + data.property_images.length + ' images');
      
      let imagesFolder;
      const existingImagesFolders = propertyFolder.getFoldersByName('Property Images');
      
      if (existingImagesFolders.hasNext()) {
        imagesFolder = existingImagesFolders.next();
      } else {
        imagesFolder = propertyFolder.createFolder('Property Images');
        Utilities.sleep(200);
      }
      
      for (let i = 0; i < data.property_images.length; i++) {
        const fileData = data.property_images[i];
        
        try {
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            continue;
          }
          
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          const file = imagesFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'image'
          });
          
          Logger.log('Uploaded image: ' + fileData.name);
          
        } catch (err) {
          Logger.log('Error uploading image: ' + err.toString());
        }
      }
    }
    
    // Process documents
    if (data.documents && data.documents.length > 0) {
      Logger.log('Processing ' + data.documents.length + ' documents');
      
      let documentsFolder;
      const existingDocsFolders = propertyFolder.getFoldersByName('Documents');
      
      if (existingDocsFolders.hasNext()) {
        documentsFolder = existingDocsFolders.next();
      } else {
        documentsFolder = propertyFolder.createFolder('Documents');
        Utilities.sleep(200);
      }
      
      for (let i = 0; i < data.documents.length; i++) {
        const fileData = data.documents[i];
        
        try {
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            continue;
          }
          
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          const file = documentsFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'document'
          });
          
          Logger.log('Uploaded document: ' + fileData.name);
          
        } catch (err) {
          Logger.log('Error uploading document: ' + err.toString());
        }
      }
    }
    
    const response = {
      success: true,
      folderUrl: propertyFolder.getUrl(),
      folderId: propertyFolder.getId(),
      files: uploadedFiles,
      message: 'Uploaded ' + uploadedFiles.length + ' files successfully'
    };
    
    Logger.log('Success: ' + uploadedFiles.length + ' files uploaded');
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    const errorResponse = {
      success: false,
      error: error.toString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testMinimal() {
  Logger.log('Testing minimal script...');
  
  const testData = {
    property_code: 'MINIMAL-TEST-' + Date.now(),
    property_images: [],
    documents: []
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
  
  return result.getContent();
}