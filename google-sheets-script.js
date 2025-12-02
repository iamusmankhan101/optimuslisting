// Google Apps Script for Logging to Google Sheets
// Deploy this to: https://docs.google.com/spreadsheets/d/1KWlcys7Wc7ujoBntQeriPWI20fX-s7jwn_IXNF7zpFw/edit

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'PropertyListings';
    const rowData = data.data;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      
      // Add headers based on sheet type
      if (sheetName === 'PropertyListings') {
        sheet.appendRow([
          'ID', 'Email', 'Source', 'Category', 'Sub Category', 'Purpose',
          'Property Code', 'Emirate', 'Area/Community', 'Building Name', 'Unit Number',
          'Bedrooms', 'Bathrooms', 'Size (Sq.Ft)', 'Maid Room', 'Furnishing', 'Condition',
          'Sale Price', 'Unit Status', 'Asking Rent', 'Number of Cheques',
          'Keys Status', 'Viewing Status', 'Agent Name', 'Agent Mobile', 'Agent Email',
          'Created At'
        ]);
      } else if (sheetName === 'BuyerRequirements') {
        sheet.appendRow([
          'ID', 'Name', 'Email', 'Phone', 'Purpose', 'Category', 'Sub Category',
          'Emirate', 'Preferred Areas', 'Bedrooms', 'Bathrooms',
          'Min Size', 'Max Size', 'Maid Room', 'Furnishing',
          'Min Budget', 'Max Budget', 'Payment Method',
          'Additional Requirements', 'Created At'
        ]);
      }
    }
    
    // Prepare row data based on sheet type
    let row = [];
    
    if (sheetName === 'PropertyListings') {
      row = [
        rowData.id || '',
        rowData.email || '',
        rowData.source_of_listing || '',
        rowData.category || '',
        rowData.sub_category || '',
        rowData.purpose || '',
        rowData.property_code || '',
        rowData.emirate || '',
        rowData.area_community || '',
        rowData.building_name || '',
        rowData.unit_number || '',
        rowData.bedrooms || '',
        rowData.bathrooms || '',
        rowData.size_sqft || '',
        rowData.maid_room || '',
        rowData.furnishing || '',
        rowData.property_condition || '',
        rowData.sale_price || '',
        rowData.unit_status || '',
        rowData.asking_rent || '',
        rowData.number_of_chq || '',
        rowData.keys_status || '',
        rowData.viewing_status || '',
        rowData.agent_name || '',
        rowData.agent_mobile || '',
        rowData.agent_email || '',
        new Date().toISOString()
      ];
    } else if (sheetName === 'BuyerRequirements') {
      row = [
        rowData.id || '',
        rowData.name || '',
        rowData.email || '',
        rowData.phone || '',
        rowData.purpose || '',
        rowData.category || '',
        rowData.sub_category || '',
        rowData.emirate || '',
        rowData.preferred_areas || '',
        rowData.bedrooms || '',
        rowData.bathrooms || '',
        rowData.min_size_sqft || '',
        rowData.max_size_sqft || '',
        rowData.maid_room || '',
        rowData.furnishing || '',
        rowData.min_budget || '',
        rowData.max_budget || '',
        rowData.payment_method || '',
        rowData.additional_requirements || '',
        new Date().toISOString()
      ];
    }
    
    // Append the row
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Data logged to ${sheetName}`,
      row: sheet.getLastRow()
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
function testScript() {
  const testData = {
    sheet: 'BuyerRequirements',
    data: {
      name: 'Test Buyer',
      email: 'test@example.com',
      phone: '+971501234567',
      purpose: 'Buy',
      category: 'Residential',
      sub_category: 'Villa',
      emirate: 'Dubai',
      bedrooms: '3',
      bathrooms: '2',
      min_budget: '2000000',
      max_budget: '3000000'
    }
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log('Test result: ' + result.getContent());
}
