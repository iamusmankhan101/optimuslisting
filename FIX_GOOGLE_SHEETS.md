# Fix Google Sheets Integration - Access Denied Error

## Problem
The Google Sheets webhook is returning a 403 "Access denied" error. This means the Apps Script deployment doesn't allow external access.

## Solution

### Step 1: Open Your Google Apps Script

1. Go to your Google Sheet
2. Click **Extensions > Apps Script**
3. You should see your `doPost` function

### Step 2: Redeploy with Correct Permissions

1. Click **Deploy** button (top right)
2. Click **Manage deployments**
3. Click the **Edit** icon (pencil) next to your deployment
4. Make sure these settings are correct:
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** ← This is critical!
5. Click **Deploy**
6. You may need to authorize the script again
7. Copy the new **Web app URL**

### Step 3: Update Your Environment Variable

The URL should look like this:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**NOT** like this (wrong):
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent/exec
```

Update your `.env.local` file:
```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec
```

### Step 4: Test Again

```bash
npm run test-sheets
```

You should see:
```
✅ Test data sent successfully!
📋 Check your Google Sheet for the new row.
```

## Alternative: Create New Deployment

If the above doesn't work, create a fresh deployment:

1. In Apps Script, click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description:** Property Listings Webhook
   - **Execute as:** Me
   - **Who has access:** **Anyone**
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [Your Project] (unsafe)**
9. Click **Allow**
10. Copy the **Web app URL**
11. Update your `.env.local` with the new URL

## Verify the Apps Script Code

Make sure your `doPost` function looks like this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const row = [
      data.id || '',
      data.email || '',
      data.source_of_listing || '',
      data.category || '',
      data.sub_category || '',
      data.purpose || '',
      data.property_code || '',
      data.emirate || '',
      data.area_community || '',
      data.building_name || '',
      data.unit_number || '',
      data.google_pin || '',
      data.bedrooms || '',
      data.bathrooms || '',
      data.size_sqft || '',
      data.maid_room || '',
      data.furnishing || '',
      data.property_condition || '',
      data.sale_price || '',
      data.unit_status || '',
      data.rented_details || '',
      data.notice_given || '',
      data.sales_agent_commission || '',
      data.asking_rent || '',
      data.number_of_chq || '',
      data.security_deposit || '',
      data.rent_agent_commission || '',
      data.keys_status || '',
      data.viewing_status || '',
      data.more_information || '',
      data.agent_code || '',
      data.agent_name || '',
      data.agent_mobile || '',
      data.agent_email || '',
      data.agent_agency || '',
      data.created_at ? new Date(data.created_at).toLocaleString() : new Date().toLocaleString()
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Common Issues

### Issue 1: "usercontent" in URL
❌ Wrong: `https://script.google.com/macros/s/.../usercontent/exec`
✅ Correct: `https://script.google.com/macros/s/.../exec`

### Issue 2: Deployment not set to "Anyone"
- Must be "Anyone" not "Anyone with Google account"
- Must be "Anyone" not "Only myself"

### Issue 3: Old Deployment
- Create a new deployment instead of using an old one
- Old deployments may have permission issues

### Issue 4: Authorization Not Completed
- You must complete the full authorization flow
- Click "Advanced" and "Go to [Project] (unsafe)"
- This is safe - it's your own script

## Test Checklist

- [ ] Apps Script has `doPost` function
- [ ] Deployment is set to "Anyone"
- [ ] URL ends with `/exec` not `/usercontent/exec`
- [ ] Environment variable is updated
- [ ] `npm run test-sheets` returns success
- [ ] New row appears in Google Sheet

## Still Not Working?

1. Check the Apps Script execution logs:
   - In Apps Script, click **Executions** (left sidebar)
   - Look for errors in recent executions

2. Test the webhook directly:
   - Use Postman or curl to send a POST request
   - Check if you get a 200 response

3. Create a simple test:
   ```javascript
   function doGet() {
     return ContentService.createTextOutput('Webhook is working!');
   }
   ```
   - Deploy and visit the URL in your browser
   - You should see "Webhook is working!"

## Need Help?

If you're still having issues:
1. Share the Apps Script execution logs
2. Verify the deployment settings screenshot
3. Test with the simple `doGet` function first
