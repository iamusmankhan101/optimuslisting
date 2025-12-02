// Add this function to your Google Apps Script and run it directly
// This will test if the script can write to the sheet

function testBuyerRequirements() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('BuyerRequirements');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      Logger.log('Creating BuyerRequirements sheet...');
      sheet = ss.insertSheet('BuyerRequirements');
      
      // Add headers
      sheet.appendRow([
        'ID', 'Name', 'Email', 'Phone', 'Purpose', 'Category', 'Sub Category',
        'Emirate', 'Preferred Areas', 'Bedrooms', 'Bathrooms',
        'Min Size', 'Max Size', 'Maid Room', 'Furnishing',
        'Min Budget', 'Max Budget', 'Payment Method',
        'Additional Requirements', 'Created At'
      ]);
      Logger.log('Headers added');
    }
    
    // Add test data
    const testRow = [
      'TEST-' + Date.now(),
      'Test Buyer',
      'test@example.com',
      '+971501234567',
      'Buy',
      'Residential',
      'Villa',
      'Dubai',
      'Arabian Ranches',
      '4',
      '3',
      '3000',
      '4000',
      'Yes',
      'Unfurnished',
      '3000000',
      '4000000',
      'Cash',
      'Test requirements',
      new Date().toISOString()
    ];
    
    sheet.appendRow(testRow);
    Logger.log('Test row added successfully!');
    Logger.log('Last row: ' + sheet.getLastRow());
    
    return 'Success! Check the BuyerRequirements sheet';
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
