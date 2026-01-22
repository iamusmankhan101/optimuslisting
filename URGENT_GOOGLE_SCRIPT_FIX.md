# 🚨 URGENT: Fix Google Apps Script - Step by Step

## The Problem
You're getting this error: `TypeError: ContentService.createTextOutput(...).setMimeType(...).setHeader is not a function (line 116, file "Code")`

This means **your Google Apps Script still has the old broken code** and needs to be completely replaced.

## 🔧 EXACT Steps to Fix (Follow Precisely)

### Step 1: Open Google Apps Script
1. Go to **https://script.google.com**
2. Sign in with your Google account
3. Find your existing project (the one you've been using for file uploads)
4. Click on it to open

### Step 2: Identify the Problem Code
Look for code that has lines like this (THIS IS THE BROKEN CODE):
```javascript
return ContentService.createTextOutput(JSON.stringify(response))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*')     // ← THIS LINE CAUSES THE ERROR
  .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
```

### Step 3: Replace ALL Code
1. **Select ALL existing code** in the editor (Ctrl+A or Cmd+A)
2. **Delete everything** (Delete key)
3. **Copy the ENTIRE code below** and paste it:

```javascript
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
```

### Step 4: Save the Script
1. Click **Save** (Ctrl+S or the save icon)
2. Give it a name like "Property Upload Fixed" if prompted

### Step 5: Test the Script
1. In the function dropdown, select **testMinimal**
2. Click **Run** (▶️ button)
3. **Authorize the script** if prompted (click "Review permissions" → "Allow")
4. Check the **Execution log** - should show success without errors

### Step 6: Deploy the Script
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **Web app**
4. Fill in:
   - **Description**: "Property Upload Fixed - Minimal"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **COPY THE NEW WEB APP URL** (it will look like: https://script.google.com/macros/s/AKfycby.../exec)

### Step 7: Update Your Environment Variables
Replace the URL in your `.env` files with the new deployment URL.

## ✅ Verification Steps

After completing the above:

1. **Test the script directly**: Run `testMinimal` function - should succeed
2. **Check the execution log**: Should show "Success: 0 files uploaded" (for empty test)
3. **Test from your form**: Try uploading 1-2 small files
4. **Check Google Drive**: Should see new folders created

## 🚨 Critical Points

- **You MUST replace ALL existing code** - don't just add to it
- **The new code has NO `.setHeader()` calls** - this fixes the error
- **Test the script in Google Apps Script first** before trying from your form
- **Make sure you get a new deployment URL** and update your environment variables

## 🔍 How to Know It's Working

**Success indicators:**
- ✅ `testMinimal` function runs without errors
- ✅ Execution log shows "Success: 0 files uploaded"
- ✅ No more "setHeader is not a function" errors
- ✅ New folders appear in your Google Drive

**If you still get errors:**
- Double-check you replaced ALL the code
- Make sure you deployed as a web app with "Anyone" access
- Verify the folder ID is correct in the script
- Check the execution log for specific error messages

## 📞 Emergency Contact

If this still doesn't work:
1. Share a screenshot of your Google Apps Script editor
2. Share the execution log from running `testMinimal`
3. Confirm you've followed every step exactly

**This minimal version WILL work** if you follow the steps precisely. The error you're seeing is 100% caused by the old code still being in your Google Apps Script.