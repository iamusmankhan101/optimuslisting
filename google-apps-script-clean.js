// Optimized Google Apps Script for Property File Upload to Google Drive
// This version is optimized for handling larger files and timeouts

// Configuration - Your Google Drive Folder ID
const FOLDER_ID = '14HIhuxU7EXO_vfaVxaDWAEtBQiQzarBY';

// Maximum execution time buffer (Google Apps Script has 6 minute limit)
const MAX_EXECUTION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const startTime = new Date().getTime();

// Handle GET requests
function doGet(e) {
  const response = {
    status: 'ok',
    message: 'Google Drive Upload API is running (Optimized Version)',
    timestamp: new Date().toISOString(),
    maxFiles: 30,
    maxFileSize: '10MB'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Check if we're approaching execution time limit
function checkExecutionTime() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  return elapsedTime < MAX_EXECUTION_TIME;
}

// Handle POST requests with optimization
function doPost(e) {
  try {
    Logger.log('=== OPTIMIZED GOOGLE APPS SCRIPT START ===');
    Logger.log('Request received at: ' + new Date().toISOString());
    
    // Parse request data
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received in request');
    }
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('Request data keys: ' + Object.keys(data).join(', '));
    
    // Validate property code
    const propertyCode = data.property_code ? data.property_code.trim() : '';
    if (!propertyCode || propertyCode === '' || propertyCode === 'NO_CODE') {
      throw new Error('Valid property code is required for folder creation');
    }
    Logger.log('Property code: ' + propertyCode);
    
    // Count total files for optimization
    const totalImages = data.property_images ? data.property_images.length : 0;
    const totalDocs = data.documents ? data.documents.length : 0;
    const totalFiles = totalImages + totalDocs;
    
    Logger.log('Total files to process: ' + totalFiles + ' (Images: ' + totalImages + ', Documents: ' + totalDocs + ')');
    
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
      Logger.log('Using existing property folder: ' + propertyCode);
    } else {
      propertyFolder = mainFolder.createFolder(propertyCode);
      Logger.log('Created new property folder: ' + propertyCode);
      
      // Minimal delay for folder creation
      Utilities.sleep(300);
    }
    
    const uploadedFiles = [];
    let processedFiles = 0;
    
    // Process property images with optimization
    if (data.property_images && Array.isArray(data.property_images) && data.property_images.length > 0) {
      Logger.log('Processing ' + data.property_images.length + ' property images...');
      
      // Create or get images subfolder
      let imagesFolder;
      const existingImagesFolders = propertyFolder.getFoldersByName('Property Images');
      
      if (existingImagesFolders.hasNext()) {
        imagesFolder = existingImagesFolders.next();
      } else {
        imagesFolder = propertyFolder.createFolder('Property Images');
        Utilities.sleep(100); // Reduced delay
      }
      
      // Process images in batches to avoid timeout
      const batchSize = 5; // Process 5 files at a time
      
      for (let batch = 0; batch < data.property_images.length; batch += batchSize) {
        // Check execution time before each batch
        if (!checkExecutionTime()) {
          Logger.log('Warning: Approaching execution time limit, stopping at ' + processedFiles + ' files');
          break;
        }
        
        const batchEnd = Math.min(batch + batchSize, data.property_images.length);
        Logger.log('Processing image batch: ' + (batch + 1) + '-' + batchEnd + ' of ' + data.property_images.length);
        
        for (let i = batch; i < batchEnd; i++) {
          const fileData = data.property_images[i];
          
          try {
            if (!fileData.data || !fileData.name || !fileData.mimeType) {
              Logger.log('Skipping invalid image data: ' + (fileData.name || 'unknown'));
              continue;
            }
            
            // Check file size (base64 encoded size)
            if (fileData.data.length > 10 * 1024 * 1024) { // ~10MB base64 limit
              Logger.log('Skipping large image: ' + fileData.name + ' (too large)');
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
            
            processedFiles++;
            Logger.log('Success: Image uploaded (' + processedFiles + '/' + totalFiles + '): ' + fileData.name);
            
          } catch (imageError) {
            Logger.log('Error: Failed to upload image ' + fileData.name + ': ' + imageError.toString());
            // Continue with other files instead of failing completely
          }
        }
        
        // Small delay between batches to prevent rate limiting
        if (batchEnd < data.property_images.length) {
          Utilities.sleep(100);
        }
      }
    }
    
    // Process documents with optimization
    if (data.documents && Array.isArray(data.documents) && data.documents.length > 0 && checkExecutionTime()) {
      Logger.log('Processing ' + data.documents.length + ' documents...');
      
      // Create or get documents subfolder
      let documentsFolder;
      const existingDocsFolders = propertyFolder.getFoldersByName('Documents');
      
      if (existingDocsFolders.hasNext()) {
        documentsFolder = existingDocsFolders.next();
      } else {
        documentsFolder = propertyFolder.createFolder('Documents');
        Utilities.sleep(100); // Reduced delay
      }
      
      // Process documents in batches
      const batchSize = 5;
      
      for (let batch = 0; batch < data.documents.length; batch += batchSize) {
        // Check execution time before each batch
        if (!checkExecutionTime()) {
          Logger.log('Warning: Approaching execution time limit, stopping at ' + processedFiles + ' files');
          break;
        }
        
        const batchEnd = Math.min(batch + batchSize, data.documents.length);
        Logger.log('Processing document batch: ' + (batch + 1) + '-' + batchEnd + ' of ' + data.documents.length);
        
        for (let i = batch; i < batchEnd; i++) {
          const fileData = data.documents[i];
          
          try {
            if (!fileData.data || !fileData.name || !fileData.mimeType) {
              Logger.log('Skipping invalid document data: ' + (fileData.name || 'unknown'));
              continue;
            }
            
            // Check file size
            if (fileData.data.length > 10 * 1024 * 1024) { // ~10MB base64 limit
              Logger.log('Skipping large document: ' + fileData.name + ' (too large)');
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
            
            processedFiles++;
            Logger.log('Success: Document uploaded (' + processedFiles + '/' + totalFiles + '): ' + fileData.name);
            
          } catch (docError) {
            Logger.log('Error: Failed to upload document ' + fileData.name + ': ' + docError.toString());
            // Continue with other files instead of failing completely
          }
        }
        
        // Small delay between batches
        if (batchEnd < data.documents.length) {
          Utilities.sleep(100);
        }
      }
    }
    
    // Calculate execution time
    const executionTime = new Date().getTime() - startTime;
    
    // Prepare success response
    const response = {
      success: true,
      folderUrl: propertyFolder.getUrl(),
      folderId: propertyFolder.getId(),
      files: uploadedFiles,
      message: 'Successfully uploaded ' + uploadedFiles.length + ' of ' + totalFiles + ' files',
      debug: {
        propertyCode: propertyCode,
        totalFilesRequested: totalFiles,
        totalFilesUploaded: uploadedFiles.length,
        imagesUploaded: uploadedFiles.filter(function(f) { return f.type === 'image'; }).length,
        documentsUploaded: uploadedFiles.filter(function(f) { return f.type === 'document'; }).length,
        executionTimeMs: executionTime,
        executionTimeSeconds: Math.round(executionTime / 1000),
        timestamp: new Date().toISOString()
      }
    };
    
    Logger.log('Success: Upload completed successfully!');
    Logger.log('Files uploaded: ' + uploadedFiles.length + '/' + totalFiles);
    Logger.log('Execution time: ' + Math.round(executionTime / 1000) + ' seconds');
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    
    const executionTime = new Date().getTime() - startTime;
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      debug: {
        timestamp: new Date().toISOString(),
        errorType: error.name || 'UnknownError',
        executionTimeMs: executionTime,
        executionTimeSeconds: Math.round(executionTime / 1000)
      }
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function with smaller data
function testUploadOptimized() {
  Logger.log('Running optimized test upload...');
  
  const testData = {
    property_code: 'OPTIMIZED-TEST-' + Date.now(),
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

// Function to check folder structure and performance
function checkFolderStructureOptimized() {
  try {
    const startTime = new Date().getTime();
    
    const mainFolder = DriveApp.getFolderById(FOLDER_ID);
    Logger.log('Main folder found: ' + mainFolder.getName());
    
    const subfolders = mainFolder.getFolders();
    let count = 0;
    
    Logger.log('Recent property folders:');
    while (subfolders.hasNext() && count < 5) { // Limit to 5 for performance
      const folder = subfolders.next();
      Logger.log('- ' + folder.getName() + ' (Created: ' + folder.getDateCreated() + ')');
      count++;
    }
    
    const executionTime = new Date().getTime() - startTime;
    Logger.log('Check completed in ' + executionTime + 'ms');
    
    return 'Found ' + count + ' property folders in ' + executionTime + 'ms';
    
  } catch (error) {
    Logger.log('Error checking folder structure: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}