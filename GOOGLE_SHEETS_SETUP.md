# Google Sheets Integration Setup

Follow these steps to integrate Google Sheets with the form:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Property Listings"
3. Add these column headers in the first row:
   - A: ID
   - B: Email
   - C: Source of Listing
   - D: Category
   - E: Sub Category
   - F: Purpose
   - G: Property Code
   - H: Emirate
   - I: Area/Community
   - J: Building Name
   - K: Unit Number
   - L: Google Pin
   - M: Bedrooms
   - N: Bathrooms
   - O: Size (Sq. Ft)
   - P: Maid Room
   - Q: Furnishing
   - R: Property Condition
   - S: Sale Price
   - T: Unit Status
   - U: Rented Details
   - V: Notice Given
   - W: Sales Agent Commission
   - X: Asking Rent
   - Y: Number of Cheques
   - Z: Security Deposit
   - AA: Rent Agent Commission
   - AB: Keys Status
   - AC: Viewing Status
   - AD: More Information
   - AE: Agent Code
   - AF: Agent Name
   - AG: Agent Mobile
   - AH: Agent Email
   - AI: Agent Agency
   - AJ: Submitted Date

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const row = [
      data.id,
      data.email,
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
      new Date(data.created_at).toLocaleString()
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy > New deployment**
4. Select type: **Web app**
5. Execute as: Your email
6. Who has access: **Anyone**
7. Click **Deploy**
8. Copy the deployment URL (it will look like: `https://script.google.com/macros/d/...`)

## Step 3: Set Environment Variable

1. In your backend folder, create a `.env` file:

```
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent/exec
```

Replace `YOUR_DEPLOYMENT_ID` with the ID from your deployment URL.

2. Install dotenv package:
```powershell
cd backend
npm install dotenv
```

3. Update `backend/server.js` to load the .env file at the top:

```javascript
import dotenv from 'dotenv';
dotenv.config();
```

## Step 4: Restart Backend

```powershell
cd backend
npm start
```

Now whenever a form is submitted, it will automatically add a row to your Google Sheet!

## Troubleshooting

- If data isn't appearing in the sheet, check the browser console for errors
- Make sure the Apps Script deployment is set to "Anyone" for access
- Verify the webhook URL is correct in your `.env` file
