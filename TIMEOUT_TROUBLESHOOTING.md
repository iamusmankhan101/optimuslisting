# 🕐 Google Drive Upload Timeout Troubleshooting

## Problem
Getting "Upload timeout (60s exceeded)" error when uploading files to Google Drive.

## Root Causes

### 1. **Large File Sizes**
- Files over 5MB take significantly longer to process
- Base64 encoding increases file size by ~33%
- Google Apps Script has processing limitations

### 2. **Too Many Files**
- Uploading 20+ files at once can exceed timeout limits
- Each file requires individual processing time
- Google Drive API rate limiting

### 3. **Network Issues**
- Slow internet connection
- Network instability during upload
- Server-side processing delays

## Solutions

### 🚀 **Immediate Fixes**

#### **1. Use the Optimized Google Apps Script**
Replace your current Google Apps Script with the optimized version from `google-apps-script-optimized.js`:

**Key Improvements:**
- ✅ Batch processing (5 files at a time)
- ✅ Execution time monitoring
- ✅ File size validation (10MB limit)
- ✅ Better error handling
- ✅ Reduced delays between operations

#### **2. File Size Limits (Already Implemented)**
- Frontend now automatically filters files > 10MB
- Users get alerts about skipped large files
- Only valid files are sent to Google Drive

#### **3. Increased Timeout (Already Implemented)**
- Timeout increased from 30s to 60s
- Better error messages for timeout scenarios

### 📋 **Best Practices for Users**

#### **File Optimization:**
1. **Compress images** before upload
   - Use JPEG instead of PNG for photos
   - Resize images to reasonable dimensions (1920x1080 max)
   - Use online compression tools

2. **Limit file count per submission:**
   - Upload 10-15 files maximum at once
   - Split large batches into multiple submissions

3. **File format recommendations:**
   - **Images**: JPEG, PNG (compressed)
   - **Documents**: PDF (compressed), DOC, DOCX
   - **Avoid**: TIFF, BMP, uncompressed formats

### 🔧 **Advanced Solutions**

#### **1. Chunked Upload Implementation**
For very large files, implement chunked uploads:

```javascript
// Future enhancement - chunked upload
const uploadInChunks = async (files, chunkSize = 5) => {
  const results = [];
  
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const chunkResult = await uploadChunk(chunk);
    results.push(...chunkResult);
    
    // Progress update
    setStatus({ 
      type: 'info', 
      message: `Uploaded ${results.length}/${files.length} files...` 
    });
  }
  
  return results;
};
```

#### **2. Background Processing**
Implement background processing for large uploads:

```javascript
// Future enhancement - background processing
const queueUpload = async (files) => {
  // Queue files for background processing
  // Return immediately with job ID
  // Poll for completion status
};
```

### 🧪 **Testing & Monitoring**

#### **1. Test with Different File Sizes**
```javascript
// Test scenarios
const testScenarios = [
  { files: 5, avgSize: '1MB', expected: 'Success' },
  { files: 10, avgSize: '2MB', expected: 'Success' },
  { files: 15, avgSize: '3MB', expected: 'Possible timeout' },
  { files: 20, avgSize: '5MB', expected: 'Likely timeout' }
];
```

#### **2. Monitor Upload Performance**
- Check Google Apps Script execution logs
- Monitor network performance during uploads
- Track success/failure rates

### 📊 **Performance Benchmarks**

#### **Typical Upload Times:**
- **1-5 files (1-2MB each)**: 10-20 seconds
- **6-10 files (2-3MB each)**: 20-40 seconds  
- **11-15 files (3-5MB each)**: 40-60 seconds
- **16+ files or >5MB each**: Risk of timeout

#### **Google Apps Script Limits:**
- **Maximum execution time**: 6 minutes
- **Maximum response size**: 50MB
- **Rate limiting**: ~100 requests/minute

### 🔄 **Retry Logic**

Implement automatic retry for failed uploads:

```javascript
const uploadWithRetry = async (data, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToGoogleDrive(data);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.log(`Upload attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};
```

### 🚨 **When to Contact Support**

Contact support if you experience:
- Consistent timeouts with small files (<2MB, <5 files)
- Google Apps Script execution errors
- Folder creation failures
- Permission-related errors

### 📈 **Success Indicators**

Upload is working correctly when you see:
- ✅ Files uploaded within 30-45 seconds
- ✅ Folders created in Google Drive
- ✅ All files accessible via returned URLs
- ✅ Console shows "Upload completed successfully"

## Quick Checklist

Before reporting timeout issues:

- [ ] Files are under 10MB each
- [ ] Uploading fewer than 15 files at once
- [ ] Using the optimized Google Apps Script
- [ ] Internet connection is stable
- [ ] Google Drive has sufficient storage space
- [ ] Property code is filled in correctly

## Emergency Workaround

If timeouts persist, temporarily disable required file validation:

1. Make file uploads optional in validation
2. Allow form submission without files
3. Upload files separately after form submission
4. Re-enable validation once issue is resolved

This ensures business continuity while troubleshooting the upload issue.