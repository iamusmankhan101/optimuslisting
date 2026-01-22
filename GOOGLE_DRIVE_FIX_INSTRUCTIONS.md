# 🔧 Google Drive Upload Fix - Step by Step Instructions

## Problem
The error `TypeError: ContentService.createTextOutput(...).setMimeType(...).setHeader is not a function` indicates that your Google Apps Script still contains the old problematic code.

## Solution Steps

### Step 1: Access Your Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Find your existing project (the one with your Google Drive upload code)
3. Open it

### Step 2: Replace ALL Code
1. **Select ALL existing code** in the Code.gs file (Ctrl+A)
2. **Delete everything**
3. **Copy and paste** the COMPLETE code below:

```javascript
// Fixed Google Apps Script for Property File Upload to Google Drive
// This version fixes the setHeader error and improves reliability

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
    Logger.log('=== GOOGLE APPS SCRIPT UPLOAD START ===');
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
      
      // Small delay to ensure folder is fully created
      Utilities.sleep(500);
    }
    
    const uploadedFiles = [];
    
    // Process property images
    if (data.property_images && Array.isArray(data.property_images) && data.property_images.length > 0) {
      Logger.log('Processing ' + data.property_images.length + ' property images...');
      
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
          Logger.log('Processing image ' + (i + 1) + '/' + data.property_images.length + ': ' + fileData.name);
          
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            Logger.log('Skipping invalid image data: ' + fileData.name);
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
          
          Logger.log('✅ Image uploaded: ' + fileData.name);
          
        } catch (imageError) {
          Logger.log('❌ Failed to upload image ' + fileData.name + ': ' + imageError.toString());
          // Continue with other files instead of failing completely
        }
      }
    }
    
    // Process documents
    if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
      Logger.log('Processing ' + data.documents.length + ' documents...');
      
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
          Logger.log('Processing document ' + (i + 1) + '/' + data.documents.length + ': ' + fileData.name);
          
          if (!fileData.data || !fileData.name || !fileData.mimeType) {
            Logger.log('Skipping invalid document data: ' + fileData.name);
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
          
          Logger.log('✅ Document uploaded: ' + fileData.name);
          
        } catch (docError) {
          Logger.log('❌ Failed to upload document ' + fileData.name + ': ' + docError.toString());
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
      message: 'Successfully uploaded ' + uploadedFiles.length + ' files',
      debug: {
        propertyCode: propertyCode,
        totalFilesUploaded: uploadedFiles.length,
        imagesCount: uploadedFiles.filter(function(f) { return f.type === 'image'; }).length,
        documentsCount: uploadedFiles.filter(function(f) { return f.type === 'document'; }).length,
        timestamp: new Date().toISOString()
      }
    };
    
    Logger.log('✅ Upload completed successfully!');
    Logger.log('Response: ' + JSON.stringify(response));
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ Error in doPost: ' + error.toString());
    
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
  Logger.log('Running test upload...');
  
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
  Logger.log('Test result: ' + result.getContent());
  
  return result.getContent();
}

// Function to check folder structure
function checkFolderStructure() {
  try {
    const mainFolder = DriveApp.getFolderById(FOLDER_ID);
    Logger.log('Main folder found: ' + mainFolder.getName());
    
    const subfolders = mainFolder.getFolders();
    let count = 0;
    
    Logger.log('Property folders:');
    while (subfolders.hasNext() && count < 10) {
      const folder = subfolders.next();
      Logger.log('- ' + folder.getName() + ' (' + folder.getUrl() + ')');
      count++;
    }
    
    return 'Found ' + count + ' property folders';
    
  } catch (error) {
    Logger.log('Error checking folder structure: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
```

### Step 3: Save the Script
1. Click **Save** (Ctrl+S)
2. Give it a name like "Property Upload Fixed" if prompted

### Step 4: Test the Script
1. In the Apps Script editor, select the `testUpload` function from the dropdown
2. Click **Run**
3. Check the **Execution log** for any errors
4. If it runs without errors, proceed to Step 5

### Step 5: Deploy the Script
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **Web app**
4. Set the following:
   - **Description**: "Property Upload Fixed"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **IMPORTANT**: Copy the new Web app URL that appears

### Step 6: Update Environment Variables
Update your environment variables with the new URL:

**In your `.env` files:**
```
GOOGLE_DRIVE_UPLOAD_URL=YOUR_NEW_WEB_APP_URL_HERE
REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=YOUR_NEW_WEB_APP_URL_HERE
```

### Step 7: Test the Fix
1. Restart your application
2. Try uploading files through your form
3. Check the browser console for success messages

## Troubleshooting

### If you still get errors:
1. **Check the Execution log** in Google Apps Script for detailed error messages
2. **Verify the FOLDER_ID** is correct in the script
3. **Make sure you deployed as a web app** with "Anyone" access
4. **Double-check the environment variables** are updated with the new URL

### Common Issues:
- **Authorization required**: Run the `testUpload` function first to authorize the script
- **Folder not found**: Verify the FOLDER_ID in the script matches your Google Drive folder
- **Still getting setHeader error**: Make sure you replaced ALL the code, not just part of it

## Success Indicators
When working correctly, you should see:
- ✅ Folders created in Google Drive with property codes as names
- ✅ Subfolders "Property Images" and "Documents" created
- ✅ Files uploaded and accessible via the URLs returned
- ✅ Console logs showing successful upload messages

## Need Help?
If you're still having issues:
1. Check the Google Apps Script execution log
2. Verify all environment variables are set correctly
3. Make sure the script has proper permissions to access Google Drive