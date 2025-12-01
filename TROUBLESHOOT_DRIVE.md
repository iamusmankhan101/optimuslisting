# Troubleshoot Google Drive Upload - 401 Error

## ❌ Problem: 401 Unauthorized / Page Not Found

Your test shows the Apps Script is returning a 401 error, which means the deployment is not accessible.

## ✅ Solution: Redeploy with Correct Settings

### Step 1: Open Your Apps Script
1. Go to https://script.google.com
2. Open your "Property File Upload" project

### Step 2: Verify the Code
Make sure line 5 has the correct folder ID:
```javascript
const FOLDER_ID = '1GjL05HE-A7tOn__fiIuxcgd6ZBhWxips';
```

### Step 3: Delete Old Deployment
1. Click "Deploy" → "Manage deployments"
2. Click the Archive icon (📦) next to your old deployment
3. Click "Archive"

### Step 4: Create New Deployment
1. Click "Deploy" → "New deployment"
2. Click the ⚙️ (gear) icon next to "Select type"
3. Choose "Web app"
4. Configure:
   - **Description:** Property File Upload v2
   - **Execute as:** Me (your-email@gmail.com)
   - **Who has access:** **Anyone** ← CRITICAL!
5. Click "Deploy"

### Step 5: Authorize (Important!)
1. Click "Authorize access"
2. Choose your Google account
3. You'll see "Google hasn't verified this app"
4. Click "Advanced"
5. Click "Go to Property File Upload (unsafe)"
6. Click "Allow" for all permissions

### Step 6: Copy New URL
1. Copy the **Web app URL**
2. It should look like: `https://script.google.com/macros/s/[NEW_ID]/exec`

### Step 7: Update Environment Variables

Update `.env.local`:
```env
REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=https://script.google.com/macros/s/[YOUR_NEW_ID]/exec
```

Update `frontend/.env.local`:
```env
REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=https://script.google.com/macros/s/[YOUR_NEW_ID]/exec
```

### Step 8: Test Again
```bash
npm run test-drive
```

You should see:
```
✅ Upload successful!
📁 Folder URL: https://drive.google.com/...
📎 Files uploaded: 2
```

## 🔍 Common Issues

### Issue 1: "Who has access" not set to "Anyone"
**Solution:** Must be "Anyone", not "Anyone with Google account"

### Issue 2: Authorization not completed
**Solution:** Must click "Advanced" → "Go to [Project] (unsafe)" → "Allow"

### Issue 3: Old deployment still active
**Solution:** Archive old deployments before creating new one

### Issue 4: Wrong URL format
**Solution:** URL must end with `/exec` not `/dev` or `/usercontent/exec`

## 📝 Checklist

Before testing, verify:
- [ ] Apps Script code has correct folder ID
- [ ] Deployment is set to "Anyone"
- [ ] Authorization completed successfully
- [ ] URL ends with `/exec`
- [ ] URL updated in both `.env.local` files
- [ ] Frontend restarted after env change

## 🧪 Test Commands

```bash
# Test Drive upload
npm run test-drive

# If successful, test from browser
cd frontend
npm start
# Go to http://localhost:3000 and submit form with files
```

## 📊 Check Apps Script Logs

1. In Apps Script, click "Executions" (left sidebar)
2. Look for recent executions
3. Click on an execution to see logs
4. Look for errors or "Uploaded image:" messages

## 🎯 Expected Behavior

When working correctly:
1. Form shows "Uploading files to Google Drive..."
2. Files convert to base64
3. Sent to Apps Script
4. Apps Script creates folder in Drive
5. Files uploaded to folder
6. URLs returned to form
7. URLs saved in database
8. Success message shows file count

## 🆘 Still Not Working?

Try this simple test in Apps Script:

```javascript
function doGet() {
  return ContentService.createTextOutput('Hello! The script is working!');
}
```

1. Add this function to your script
2. Deploy as Web app
3. Visit the URL in your browser
4. You should see "Hello! The script is working!"
5. If not, the deployment settings are wrong

## 📞 Alternative: Test with Postman

1. Open Postman or use curl
2. Send POST request to your deployment URL
3. Body (JSON):
```json
{
  "property_code": "TEST-001",
  "property_images": [],
  "documents": []
}
```
4. Should return success response

## ✅ Success Indicators

You'll know it's working when:
- Test script returns 200 OK
- Response includes `"success": true`
- Folder appears in Google Drive
- Files are inside the folder
- Form submission completes without errors
