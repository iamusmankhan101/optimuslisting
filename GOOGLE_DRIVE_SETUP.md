# Google Drive File Upload Setup

This guide will help you set up automatic file uploads to Google Drive for property images and documents.

## Step 1: Create a Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named "Property Listings Files"
3. Right-click the folder → Share → Change to "Anyone with the link can view"
4. Copy the folder ID from the URL (the part after `/folders/`)
   - Example: `https://drive.google.com/drive/folders/1ABC123xyz` → Folder ID is `1ABC123xyz`

## Step 2: Create Google Apps Script for File Upload

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project named "Property File Upload"
3. Delete the default code and paste this:

```javascript
// Configuration
const FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // Replace with your folder ID

function doPost(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const data = JSON.parse(e.postData.contents);
    
    // Create a subfolder for this property
    const propertyCode = data.property_code || 'NO_CODE';
    const timestamp = new Date().getTime();
    const subfolderName = `${propertyCode}_${timestamp}`;
    const subfolder = folder.createFolder(subfolderName);
    
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
        } catch (err) {
          Logger.log('Error uploading document: ' + err.toString());
        }
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      folderUrl: subfolder.getUrl(),
      folderId: subfolder.getId(),
      files: uploadedFiles,
      message: `Uploaded ${uploadedFiles.length} files successfully`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
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
  
  Logger.log(result.getContent());
}
```

4. Replace `YOUR_FOLDER_ID_HERE` with your actual folder ID
5. Click **Deploy > New deployment**
6. Select type: **Web app**
7. Configure:
   - **Execute as:** Me
   - **Who has access:** Anyone
8. Click **Deploy**
9. Authorize the script (click "Advanced" → "Go to [Project] (unsafe)" → "Allow")
10. Copy the **Web app URL**

## Step 3: Update Environment Variables

Add to your `.env.local` file:

```env
GOOGLE_DRIVE_UPLOAD_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Step 4: The Frontend is Already Set Up

The form will automatically:
1. Convert files to base64
2. Send them to the Google Apps Script
3. Receive back the Google Drive URLs
4. Store the URLs in the database

## How It Works

### Upload Flow:
1. User selects files in the form
2. Files are converted to base64 format
3. On form submission, files are sent to Google Apps Script
4. Apps Script creates a subfolder for the property
5. Files are uploaded to Google Drive
6. Drive URLs are returned
7. URLs are stored in the database

### Folder Structure:
```
Property Listings Files/
├── PROP-001_1234567890/
│   ├── Property Images/
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   └── Documents/
│       ├── document1.pdf
│       └── document2.pdf
└── PROP-002_1234567891/
    └── ...
```

## Testing

1. Fill out the property form
2. Upload some test images and documents
3. Submit the form
4. Check your Google Drive folder
5. Verify files are uploaded in the correct structure

## Troubleshooting

### Files Not Uploading
- Check the Apps Script execution logs
- Verify the folder ID is correct
- Ensure the deployment is set to "Anyone"
- Check file size limits (max 10 MB per file)

### Permission Errors
- Make sure you authorized the script
- Verify the folder sharing settings
- Check that the script has Drive access

### Large Files
- Google Apps Script has a 6-minute execution timeout
- For many large files, consider uploading in batches
- Alternatively, use Google Drive API directly

## File Size Limits

- **Apps Script:** 50 MB total per execution
- **Individual files:** 10 MB recommended
- **Total files:** Up to 10 per submission

## Security Notes

- Files are uploaded to your personal Google Drive
- Subfolder names include property code and timestamp
- Files are set to "Anyone with link can view"
- Consider adding authentication for production use

## Advanced: Direct Google Drive API

For production with many files, consider using Google Drive API directly:
1. Enable Google Drive API in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Use `@google-cloud/storage` or similar library
4. Implement resumable uploads for large files

## Benefits of Google Drive

- ✅ Free storage (15 GB)
- ✅ Easy sharing and viewing
- ✅ Automatic organization
- ✅ Built-in file preview
- ✅ No additional infrastructure needed
- ✅ Integrates with Google Workspace

## Next Steps

After setup:
1. Test with sample files
2. Verify folder structure
3. Check file accessibility
4. Update admin panel to show file links
5. Add file preview functionality
