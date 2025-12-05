# Troubleshooting Google Drive Upload Issues

## Quick Checks

### 1. Verify Environment Variable
Check that `REACT_APP_GOOGLE_DRIVE_UPLOAD_URL` is set in:
- `frontend/.env.local` (for local development)
- Vercel Environment Variables (for production)

Current URL: `https://script.google.com/macros/s/AKfycbz1hVb5sNOs-uVO3Y3HLCn0BR3dXTZukOMrWPmS0Xxud9KfxxTVhBWXuR3eVzUoN_gMAw/exec`

### 2. Check Apps Script Deployment
1. Go to your Apps Script project
2. Click **Deploy** → **Manage deployments**
3. Verify the deployment is active
4. Check "Execute as: Me" and "Who has access: Anyone"

### 3. Test the Script Directly
In Apps Script editor:
1. Select `testUpload` function from dropdown
2. Click Run ▶️
3. Check execution logs (View → Logs)
4. Should create an empty folder in your Drive

### 4. Check Execution Logs
1. In Apps Script, click **Executions** (clock icon)
2. Look for recent POST requests
3. Click on any execution to see detailed logs
4. Look for errors

## Common Issues & Solutions

### Issue: "Files not uploading"

**Solution 1: Re-deploy the script**
1. In Apps Script, click **Deploy** → **Manage deployments**
2. Click pencil icon ✏️ on your deployment
3. Under "Version", select **"New version"**
4. Click **Deploy**
5. URL stays the same (no need to update environment variables)

**Solution 2: Check file size**
- Max file size: 10 MB per file
- Total payload: 50 MB per request
- If files are too large, they won't upload

**Solution 3: Verify folder permissions**
```
1. Go to Google Drive folder: https://drive.google.com/drive/folders/1GjL05HE-A7tOn__fiIuxcgd6ZBhWxips
2. Right-click → Share
3. Ensure "Anyone with the link" can view
4. Copy the folder ID and verify it matches in the script
```

### Issue: "CORS errors"

**Solution:**
The Apps Script deployment must be set to "Anyone" access. If you see CORS errors:
1. Redeploy with "Who has access: Anyone"
2. Clear browser cache
3. Try again

### Issue: "Script timeout"

**Solution:**
- Reduce number of files per upload
- Compress images before upload
- Upload in batches

### Issue: "Permission denied"

**Solution:**
1. Re-authorize the script
2. Go to Apps Script → Run any function
3. Click "Review permissions"
4. Allow access to Google Drive

## Testing Steps

### Test 1: Direct Script Test
```javascript
// In Apps Script, run testUpload()
// Check logs for: "Test result: {"success":true,...}"
```

### Test 2: Browser Test
```
1. Open browser console (F12)
2. Go to property listing form
3. Upload a small test image
4. Submit form
5. Check console for any errors
6. Check Network tab for the Drive upload request
```

### Test 3: Check Drive Folder
```
1. Go to: https://drive.google.com/drive/folders/1GjL05HE-A7tOn__fiIuxcgd6ZBhWxips
2. Look for new subfolders with property codes
3. Check if files are inside
```

## Debug Mode

Add this to your form submission to see detailed logs:

```javascript
console.log('Uploading to:', driveUploadUrl);
console.log('Files to upload:', {
  images: propertyImages.length,
  documents: documents.length
});
console.log('Drive response:', driveData);
```

## Manual Test

Test the upload endpoint directly:

```bash
curl -X POST "https://script.google.com/macros/s/AKfycbz1hVb5sNOs-uVO3Y3HLCn0BR3dXTZukOMrWPmS0Xxud9KfxxTVhBWXuR3eVzUoN_gMAw/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "property_code": "TEST-MANUAL",
    "property_images": [],
    "documents": []
  }'
```

Should return:
```json
{
  "success": true,
  "folderUrl": "https://drive.google.com/...",
  "files": [],
  "message": "Uploaded 0 files successfully"
}
```

## If Nothing Works

1. **Create a new Apps Script deployment:**
   - Deploy → New deployment
   - Get new URL
   - Update environment variables

2. **Check Google Drive quota:**
   - You might be out of storage space
   - Check: https://drive.google.com/settings/storage

3. **Verify the form is sending files:**
   - Add console.log in MultiStepForm.js
   - Check if propertyImages and documents arrays have data

## Contact Support

If issues persist, check:
- Apps Script execution logs
- Browser console errors
- Network tab in DevTools
- Google Drive storage quota
