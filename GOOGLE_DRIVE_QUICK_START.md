# Google Drive File Upload - Quick Start

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Drive Folder (1 min)
1. Go to https://drive.google.com
2. Click "New" → "Folder"
3. Name it "Property Listings Files"
4. Right-click folder → "Share" → "Anyone with the link"
5. Copy the folder ID from URL: `https://drive.google.com/drive/folders/[THIS_IS_THE_ID]`

### Step 2: Create Apps Script (2 min)
1. Go to https://script.google.com
2. Click "New Project"
3. Name it "Property File Upload"
4. Copy the code from `GOOGLE_DRIVE_SETUP.md` (the `doPost` function)
5. Replace `YOUR_FOLDER_ID_HERE` with your folder ID from Step 1
6. Click "Save" (💾 icon)

### Step 3: Deploy (1 min)
1. Click "Deploy" → "New deployment"
2. Click ⚙️ next to "Select type" → Choose "Web app"
3. Settings:
   - Description: "Property File Upload API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click "Deploy"
5. Click "Authorize access"
6. Choose your Google account
7. Click "Advanced" → "Go to [Project] (unsafe)" → "Allow"
8. Copy the **Web app URL**

### Step 4: Update Environment Variable (1 min)
1. Open `.env.local` in your project
2. Find the line: `REACT_APP_GOOGLE_DRIVE_UPLOAD_URL=...`
3. Replace with your Web app URL
4. Save the file

### Step 5: Restart Frontend
```bash
cd frontend
npm start
```

## ✅ Test It!

1. Go to http://localhost:3000
2. Fill out the property form
3. In "Viewing & Status" section, upload some test files:
   - Upload 1-2 images in "Upload Property Images"
   - Upload 1-2 PDFs in "Add Documents"
4. Complete and submit the form
5. Check your Google Drive folder - you should see:
   ```
   Property Listings Files/
   └── [PROPERTY_CODE]_[TIMESTAMP]/
       ├── Property Images/
       │   └── your-image.jpg
       └── Documents/
           └── your-document.pdf
   ```

## 🎯 What Happens

1. **User uploads files** → Files are selected in the form
2. **Form submission** → Files are converted to base64
3. **Sent to Apps Script** → Files are uploaded to Google Drive
4. **Drive URLs returned** → Links are saved in database
5. **Success!** → User sees confirmation with file count

## 📊 File Organization

Each property gets its own folder:
- **Folder name:** `[PropertyCode]_[Timestamp]`
- **Subfolders:** 
  - `Property Images/` - All property photos
  - `Documents/` - PDFs, documents, additional files

## 🔧 Troubleshooting

### "Permission denied" error
- Make sure you clicked "Allow" during authorization
- Redeploy the script and authorize again

### Files not appearing in Drive
- Check Apps Script execution logs: Script Editor → "Executions" (left sidebar)
- Verify folder ID is correct
- Ensure folder is shared with "Anyone with link"

### "Network error" in form
- Check the Web app URL in `.env.local`
- Make sure it ends with `/exec`
- Verify the deployment is active

### Files too large
- Max 10 MB per file
- Max 10 files per upload
- Total execution time: 6 minutes

## 💡 Pro Tips

1. **Test with small files first** (< 1 MB)
2. **Check Drive folder** after each test
3. **View execution logs** in Apps Script for debugging
4. **Share folder** with team members for collaboration

## 🎨 Customization

### Change folder structure:
Edit the Apps Script `doPost` function:
```javascript
const subfolderName = `${propertyCode}_${data.emirate}_${timestamp}`;
```

### Add file validation:
```javascript
if (fileData.size > 10 * 1024 * 1024) {
  throw new Error('File too large');
}
```

### Organize by date:
```javascript
const date = new Date().toISOString().split('T')[0];
const dateFolder = folder.createFolder(date);
const subfolder = dateFolder.createFolder(subfolderName);
```

## 📝 Next Steps

After successful setup:
1. ✅ Test with various file types
2. ✅ Verify all files upload correctly
3. ✅ Check database has Drive URLs
4. ✅ Update admin panel to show file links
5. ✅ Add file preview functionality

## 🚀 Production Checklist

Before deploying to production:
- [ ] Test with maximum file sizes
- [ ] Test with 10 files at once
- [ ] Verify folder permissions
- [ ] Test on different browsers
- [ ] Add error handling for failed uploads
- [ ] Consider adding file type validation
- [ ] Set up monitoring for failed uploads
- [ ] Document the process for your team

## 📞 Need Help?

Common issues and solutions are in `GOOGLE_DRIVE_SETUP.md`

---

**Estimated Setup Time:** 5 minutes
**Difficulty:** Easy
**Cost:** Free (Google Drive 15 GB)
