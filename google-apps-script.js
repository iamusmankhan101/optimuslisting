// Google Apps Script for Property File Upload to Google Drive
// Copy this entire code and paste it into your Google Apps Script project

// Configuration - Your Google Drive Folder ID
const FOLDER_ID = '1mZHljfLGBsUeae3GzlCln3ZRgG509-IIn7F2VwxcLC7ykCtwgqJNoswUBa3FaCsm93qAHuRV';

// Handle CORS preflight requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Google Drive Upload API is running'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    Logger.log('=== GOOGLE APPS SCRIPT DEBUG ===');
    Logger.log('Request received at: ' + new Date().toISOString());
    
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);
    
    Logger.log('Parsed data keys: ' + Object.keys(data).join(', '));
    Logger.log('Property code: ' + data.property_code);
    Logger.log('Images count: ' + (data.property_images?.length || 0));
    Logger.log('Documents count: ' + (data.documents?.length || 0));
    
    // Validate property code
    const propertyCode = data.property_code?.trim();
    if (!propertyCode || propertyCode === '' || propertyCode === 'NO_CODE') {
      throw new Error('Valid property code is required');
    }
    
    // Create a subfolder for this property using property code
    let subfolder;
    const existingFolders = folder.getFoldersByName(propertyCode);
    if (existingFolders.hasNext()) {
      subfolder = existingFolders.next();
      Logger.log('Using existing folder: ' + propertyCode);
    } else {
      try {
        subfolder = folder.createFolder(propertyCode);
        Logger.log('Created new folder: ' + propertyCode);
        
        // Wait a moment for folder creation to complete
        Utilities.sleep(500);
        
        // Verify folder was created
        if (!subfolder || !subfolder.getId()) {
          throw new Error('Failed to create folder - folder object is invalid');
        }
        
      } catch (folderError) {
        Logger.log('Folder creation error: ' + folderError.toString());
        throw new Error('Failed to create folder: ' + folderError.toString());
      }
    }
    
    const uploadedFiles = [];
    let totalFilesProcessed = 0;
    
    // Process property images
    if (data.property_images && data.property_images.length > 0) {
      Logger.log('Processing property images...');
      
      let imagesFolder;
      try {
        // Check if images folder already exists
        const existingImagesFolders = subfolder.getFoldersByName('Property Images');
        if (existingImagesFolders.hasNext()) {
          imagesFolder = existingImagesFolders.next();
        } else {
          imagesFolder = subfolder.createFolder('Property Images');
          Utilities.sleep(200); // Brief pause after folder creation
        }
      } catch (imgFolderError) {
        Logger.log('Images folder creation error: ' + imgFolderError.toString());
        throw new Error('Failed to create images folder: ' + imgFolderError.toString());
      }
      
      data.property_images.forEach((fileData, index) => {
        try {
          Logger.log('Processing image ' + (index + 1) + '/' + data.property_images.length + ': ' + fileData.name);
          
          // Validate file data
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            throw new Error('Invalid file data structure');
          }
          
          // Decode base64 file data
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          // Validate blob
          if (!blob || blob.getBytes().length === 0) {
            throw new Error('Failed to create blob or blob is empty');
          }
          
          const file = imagesFolder.createFile(blob);
          
          // Verify file was created
          if (!file || !file.getId()) {
            throw new Error('File creation failed - file object is invalid');
          }
          
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'image',
            size: blob.getBytes().length
          });
          
          totalFilesProcessed++;
          Logger.log('✅ Uploaded image: ' + fileData.name + ' (' + blob.getBytes().length + ' bytes)');
          
        } catch (err) {
          Logger.log('❌ Error uploading image ' + fileData.name + ': ' + err.toString());
          throw new Error('Failed to upload image "' + fileData.name + '": ' + err.toString());
        }
      });
    }
    
    // Process documents
    if (data.documents && data.documents.length > 0) {
      Logger.log('Processing documents...');
      
      let docsFolder;
      try {
        // Check if documents folder already exists
        const existingDocsFolders = subfolder.getFoldersByName('Documents');
        if (existingDocsFolders.hasNext()) {
          docsFolder = existingDocsFolders.next();
        } else {
          docsFolder = subfolder.createFolder('Documents');
          Utilities.sleep(200); // Brief pause after folder creation
        }
      } catch (docsFolderError) {
        Logger.log('Documents folder creation error: ' + docsFolderError.toString());
        throw new Error('Failed to create documents folder: ' + docsFolderError.toString());
      }
      
      data.documents.forEach((fileData, index) => {
        try {
          Logger.log('Processing document ' + (index + 1) + '/' + data.documents.length + ': ' + fileData.name);
          
          // Validate file data
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            throw new Error('Invalid file data structure');
          }
          
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          // Validate blob
          if (!blob || blob.getBytes().length === 0) {
            throw new Error('Failed to create blob or blob is empty');
          }
          
          const file = docsFolder.createFile(blob);
          
          // Verify file was created
          if (!file || !file.getId()) {
            throw new Error('File creation failed - file object is invalid');
          }
          
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          uploadedFiles.push({
            name: fileData.name,
            url: file.getUrl(),
            id: file.getId(),
            type: 'document',
            size: blob.getBytes().length
          });
          
          totalFilesProcessed++;
          Logger.log('✅ Uploaded document: ' + fileData.name + ' (' + blob.getBytes().length + ' bytes)');
          
        } catch (err) {
          Logger.log('❌ Error uploading document ' + fileData.name + ': ' + err.toString());
          throw new Error('Failed to upload document "' + fileData.name + '": ' + err.toString());
        }
      });
    }
    
    Logger.log('✅ Upload completed successfully!');
    Logger.log('Total files processed: ' + totalFilesProcessed);
    Logger.log('Folder URL: ' + subfolder.getUrl());
    
    const response = {
      success: true,
      folderUrl: subfolder.getUrl(),
      folderId: subfolder.getId(),
      files: uploadedFiles,
      message: 'Uploaded ' + uploadedFiles.length + ' files successfully',
      debug: {
        propertyCode: propertyCode,
        totalFiles: totalFilesProcessed,
        timestamp: new Date().toISOString()
      }
    };
    
    Logger.log('Sending response: ' + JSON.stringify(response));
    
    return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    const errorMessage = error.toString();
    Logger.log('❌ CRITICAL ERROR: ' + errorMessage);
    
    const errorResponse = {
      success: false,
      error: errorMessage,
      debug: {
        timestamp: new Date().toISOString(),
        errorType: error.name || 'Unknown'
      }
    };
    
    Logger.log('Sending error response: ' + JSON.stringify(errorResponse));
    
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - Run this to verify the script works
function testUpload() {
  const testData = {
    property_code: 'TEST-001',
    property_images: [],
    documents: []
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log('Test result: ' + result.getContent());
}

// Function to list recent uploads
function listRecentUploads() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const subfolders = folder.getFolders();
  
  Logger.log('Recent uploads:');
  let count = 0;
  while (subfolders.hasNext() && count < 10) {
    const subfolder = subfolders.next();
    Logger.log('- ' + subfolder.getName() + ' (' + subfolder.getUrl() + ')');
    count++;
  }
}
