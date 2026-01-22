// Debug the Google Apps Script deployment
const GOOGLE_DRIVE_URL = 'https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec';

async function debugDeployment() {
  console.log('🔍 Debugging Google Apps Script deployment...');
  console.log('URL:', GOOGLE_DRIVE_URL);
  
  try {
    // Try different request methods
    const methods = ['GET', 'POST', 'OPTIONS'];
    
    for (const method of methods) {
      console.log(`\n--- Testing ${method} request ---`);
      
      try {
        const response = await fetch(GOOGLE_DRIVE_URL, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: method === 'POST' ? JSON.stringify({test: true}) : undefined
        });
        
        console.log(`${method} Status:`, response.status);
        console.log(`${method} Headers:`, Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log(`${method} Response length:`, text.length);
        
        if (text.includes('Script function not found')) {
          console.log('❌ Function not found error detected');
        } else if (text.includes('success')) {
          console.log('✅ Success response detected');
        } else {
          console.log('⚠️ Unexpected response format');
        }
        
      } catch (error) {
        console.log(`❌ ${method} failed:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugDeployment();