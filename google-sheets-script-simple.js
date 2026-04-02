// Simplified Google Apps Script - Copy this to your Apps Script editor
// This version has better error handling and logging

function doPost(e) {
  try {
    // Log everything for debugging
    Logger.log('=== POST Request Received ===');
    
    // Check if postData exists
    if (!e || !e.postData) {
      throw new Error('No postData received');
    }
    
    Logger.log('Raw postData: ' + e.postData.contents);
    
    // Parse the data
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'PropertyListings';
    const rowData = data.data;
    
    Logger.log('Sheet name: ' + sheetName);
    Logger.log('Row data keys: ' + Object.keys(rowData).join(', '));
    
    // Get the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('Spreadsheet name: ' + ss.getName());
    
    let sheet = ss.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      Logger.log('Creating new sheet: ' + sheetName);
      sheet = ss.insertSheet(sheetName);
      
      // Add headers
      if (sheetName === 'BuyerRequirements') {
        sheet.appendRow([
          'ID', 'Name', 'Email', 'Phone', 'Purpose', 'Category', 'Sub Category',
          'Emirate', 'Preferred Areas', 'Bedrooms', 'Bathrooms',
          'Min Size', 'Max Size', 'Maid Room', 'Furnishing',
          'Min Budget', 'Max Budget', 'Payment Method',
          'Additional Requirements', 'Created At'
        ]);
        Logger.log('Headers added to BuyerRequirements');
      } else if (sheetName === 'PropertyListings') {
        sheet.appendRow([
          'ID', 'Email', 'Source', 'Category', 'Sub Category', 'Purpose',
          'Property Code', 'Emirate', 'Area/Community', 'Building Name', 'Unit Number',
          'Bedrooms', 'Bathrooms', 'Size (Sq.Ft)', 'Maid Room', 'Furnishing', 'Condition',
          'Sale Price', 'Unit Status', 'Asking Rent', 'Number of Cheques',
          'Keys Status', 'Viewing Status', 'Agent Name', 'Agent Mobile', 'Agent Email',
          'Created At'
        ]);
        Logger.log('Headers added to PropertyListings');
      }
    } else {
      Logger.log('Sheet already exists: ' + sheetName);
    }
    
    // Prepare row data
    let row = [];
    
    if (sheetName === 'BuyerRequirements') {
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
    } else if (sheetName === 'PropertyListings') {
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
    }
    
    Logger.log('Row data prepared, length: ' + row.length);
    
    // Append the row
    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();
    Logger.log('Row appended successfully at row: ' + lastRow);
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data logged to ' + sheetName,
      row: lastRow,
      sheetName: sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing in browser)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'Google Sheets Logger is running',
    message: 'Use POST requests to log data',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this directly in Apps Script
function testBuyerLead() {
  const testData = {
    sheet: 'BuyerRequirements',
    data: {
      id: 'TEST-' + Date.now(),
      name: 'Test Buyer',
      email: 'test@example.com',
      phone: '+971501234567',
      purpose: 'Buy',
      category: 'Residential',
      sub_category: 'Villa',
      emirate: 'Dubai',
      preferred_areas: 'Arabian Ranches',
      bedrooms: '4',
      bathrooms: '3',
      min_size_sqft: '3000',
      max_size_sqft: '4000',
      maid_room: 'Yes',
      furnishing: 'Unfurnished',
      min_budget: '3000000',
      max_budget: '4000000',
      payment_method: 'Cash',
      additional_requirements: 'Test requirements'
    }
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log('=== Test Result ===');
  Logger.log(result.getContent());
  
  return result.getContent();
}
