# Deploy Google Drive File Upload - Step by Step

Your Google Drive folder is ready! Follow these exact steps:

## ✅ Your Folder Details
- **Folder Name:** Property Listings Files
- **Folder ID:** `1iFSK34NWPlWKj6dE2RZkFDaDrobcQWYd`
- **Folder URL:** https://drive.google.com/drive/folders/1iFSK34NWPlWKj6dE2RZkFDaDrobcQWYd

## 📝 Step 1: Create Google Apps Script (2 minutes)

1. **Open Google Apps Script:**
   - Go to: https://script.google.com
   - Click "New Project"

2. **Name your project:**
   - Click "Untitled project" at the top
   - Rename to: "Property File Upload"

3. **Copy the code:**
   - Open the file `google-apps-script.js` in your project
   - Copy ALL the code (Ctrl+A, Ctrl+C)

4. **Paste into Apps Script:**
   - Delete the default `function myFunction() {}` code
   - Paste your copied code (Ctrl+V)
   - Click the Save icon (💾) or press Ctrl+S

## 🚀 Step 2: Deploy the Script (2 minutes)

1. **Start deployment:**
   - Click "Deploy" button (top right)
   - Select "New deployment"

2. **Configure deployment:**
   - Click the ⚙️ (gear icon) next to "Select type"
   - Choose "Web app"

3. **Set deployment settings:**
   - **Description:** Property File Upload API
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone ← IMPORTANT!
   - Click "Deploy"

4. **Authorize the script:**
   - Click "Authorize access"
   - Choose your Google account
   - You'll see a warning "Google hasn't verified this app"
   - Click "Advanced"
   - Click "Go to Property File Upload (unsafe)"
   - Click "Allow"

5. **Copy the Web App URL:**
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycby.../exec`
   - Click "Copy" or select and copy the entire URL
   - **SAVE THIS URL** - you'll need it in the next step!

## 🔧 Step 3: Update Your Project (1 minute)

1. **Open `.env.local` file** in your project root

2. **Find this line:**
   ```env
   REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

3. **Replace with your URL:**
   ```env
   REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=https://script.google.com/macros/s/[PASTE_YOUR_URL_HERE]/exec
   ```

4. **Save the file** (Ctrl+S)

## 🔄 Step 4: Restart Your App

```bash
# Stop the frontend if it's running (Ctrl+C)
cd frontend
npm start
```

## ✅ Step 5: Test It!

1. **Open your app:** http://localhost:3000

2. **Fill out the form:**
   - Go through all the steps
   - When you reach "Viewing & Status" section

3. **Upload test files:**
   - Click "Upload Property Images" → Select 1-2 images
   - Click "Add Documents" → Select 1-2 PDFs or documents

4. **Submit the form**

5. **Check Google Drive:**
   - Go to: https://drive.google.com/drive/folders/1iFSK34NWPlWKj6dE2RZkFDaDrobcQWYd
   - You should see a new folder like: `PROP-001_1234567890`
   - Inside, you'll find:
     - `Property Images/` folder with your images
     - `Documents/` folder with your documents

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Form shows "Uploading files to Google Drive..."
- ✅ Form shows "Submitting property listing..."
- ✅ Success message includes file count
- ✅ New folder appears in Google Drive
- ✅ Files are inside the folder

## 🐛 Troubleshooting

### Issue: "Permission denied" error
**Solution:**
1. Go back to Apps Script
2. Click "Deploy" → "Manage deployments"
3. Click Edit (pencil icon)
4. Make sure "Who has access" is set to "Anyone"
5. Click "Deploy"

### Issue: Files not appearing in Drive
**Solution:**
1. In Apps Script, click "Executions" (left sidebar)
2. Look for errors in recent executions
3. Check if the folder ID is correct
4. Verify folder sharing is set to "Anyone with link"

### Issue: "Network error" in form
**Solution:**
1. Check the URL in `.env.local` is correct
2. Make sure it ends with `/exec`
3. Restart the frontend: `cd frontend && npm start`

### Issue: Script authorization failed
**Solution:**
1. Try in an incognito/private browser window
2. Make sure you're using the same Google account
3. Clear browser cache and try again

## 📊 View Upload Logs

To see what's happening:
1. Go to Apps Script
2. Click "Executions" (left sidebar)
3. Click on any execution to see logs
4. Look for "Uploaded image:" or "Uploaded document:" messages

## 🔍 Test the Script Directly

In Apps Script:
1. Select the `testUpload` function from the dropdown
2. Click "Run"
3. Check "Executions" for results
4. This creates a test folder in your Drive

## 📝 What Gets Stored in Database

After successful upload, the database will contain:
- `property_images`: Comma-separated Google Drive URLs
- `documents`: Comma-separated Google Drive URLs

Example:
```
property_images: "https://drive.google.com/file/d/abc123/view, https://drive.google.com/file/d/def456/view"
documents: "https://drive.google.com/file/d/ghi789/view"
```

## 🎯 Next Steps

After successful setup:
1. ✅ Test with different file types (JPG, PNG, PDF, DOC)
2. ✅ Test with multiple files (up to 10)
3. ✅ Verify files are accessible via the URLs
4. ✅ Update admin panel to display file links
5. ✅ Add file preview functionality

## 💡 Pro Tips

- **Organize by date:** Files are automatically organized by property code and timestamp
- **Share with team:** Share the main folder with team members for collaboration
- **Monitor uploads:** Check "Executions" regularly to catch any issues
- **Backup:** Google Drive automatically backs up your files

## 🚀 Ready for Production

Before deploying to Vercel:
1. Add `REACT_APP_GOOGLE_DRIVE_UPLOAD_URL` to Vercel environment variables
2. Test file uploads on production
3. Monitor Apps Script execution logs
4. Set up alerts for failed uploads

---

**Estimated Time:** 5 minutes
**Difficulty:** Easy
**Your Folder:** https://drive.google.com/drive/folders/1iFSK34NWPlWKj6dE2RZkFDaDrobcQWYd
