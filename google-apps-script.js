// Google Apps Script for Property File Upload to Google Drive
// Copy this entire code and paste it into your Google Apps Script project

// Configuration - Your Google Drive Folder ID
const FOLDER_ID = '1mZHljfLGBsUeae3GzlCln3ZRgG509-IIn7F2VwxcLC7ykCtwgqJNoswUBa3FaCsm93qAHuRV';

function doPost(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);
    
    // Create a subfolder for this property using property code
    const propertyCode = data.property_code || 'NO_CODE';
    
    // Check if folder already exists, if so, use it; otherwise create new
    let subfolder;
    const existingFolders = folder.getFoldersByName(propertyCode);
    if (existingFolders.hasNext()) {
      subfolder = existingFolders.next();
      Logger.log('Using existing folder: ' + propertyCode);
    } else {
      subfolder = folder.createFolder(propertyCode);
      Logger.log('Created new folder: ' + propertyCode);
    }
    
    const uploadedFiles = [];
    
    // Process property images
    if (data.property_images && data.property_images.length > 0) {
      const imagesFolder = subfolder.createFolder('Property Images');
      
      data.property_images.forEach((fileData, index) => {
        try {
          // Decode base64 file data
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
      });
    }
    
    // Process documents
    if (data.documents && data.documents.length > 0) {
      const docsFolder = subfolder.createFolder('Documents');
      
      data.documents.forEach((fileData, index) => {
        try {
          const blob = Utilities.newBlob(
            Utilities.base64Decode(fileData.data),
            fileData.mimeType,
            fileData.name
          );
          
          const file = docsFolder.createFile(blob);
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
      });
    }
    
    Logger.log('Total files uploaded: ' + uploadedFiles.length);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      folderUrl: subfolder.getUrl(),
      folderId: subfolder.getId(),
      files: uploadedFiles,
      message: 'Uploaded ' + uploadedFiles.length + ' files successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
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
