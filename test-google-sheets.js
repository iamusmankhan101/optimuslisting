import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGoogleSheets() {
  console.log('🧪 Testing Google Sheets Integration...\n');

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('❌ GOOGLE_SHEET_WEBHOOK_URL not found in environment variables');
    return;
  }

  console.log('📍 Webhook URL:', webhookUrl);
  console.log('\n📤 Sending test data...\n');

  const testData = {
    id: 999,
    email: 'test@example.com',
    source_of_listing: 'Test Source',
    category: 'Residential',
    sub_category: 'Apartment',
    purpose: 'Sale',
    property_code: 'TEST-999',
    emirate: 'Dubai',
    area_community: 'Downtown',
    building_name: 'Test Tower',
    unit_number: '101',
    google_pin: 'https://maps.google.com',
    bedrooms: '2',
    bathrooms: '2',
    size_sqft: '1200',
    maid_room: 'No',
    furnishing: 'Furnished',
    property_condition: 'Excellent',
    sale_price: '1,500,000 AED',
    unit_status: 'Vacant',
    rented_details: '',
    notice_given: '',
    sales_agent_commission: '2%',
    asking_rent: '',
    number_of_chq: '',
    security_deposit: '',
    rent_agent_commission: '',
    keys_status: 'Available',
    viewing_status: 'Available',
    more_information: 'Test property listing',
    agent_code: 'AG001',
    agent_name: 'Test Agent',
    agent_mobile: '+971501234567',
    agent_email: 'agent@example.com',
    agent_agency: 'Test Agency',
    created_at: new Date().toISOString()
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      console.log('\n✅ Test data sent successfully!');
      console.log('📋 Check your Google Sheet for the new row.');
    } else {
      console.log('\n❌ Failed to send data to Google Sheets');
      console.log('💡 Possible issues:');
      console.log('   - Webhook URL might be incorrect');
      console.log('   - Apps Script deployment might not be set to "Anyone"');
      console.log('   - Apps Script might have errors');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify the webhook URL is correct');
    console.log('   2. Check if the Google Apps Script is deployed');
    console.log('   3. Ensure the deployment is set to "Anyone" access');
    console.log('   4. Test the webhook URL directly in a browser');
  }
}

testGoogleSheets();
