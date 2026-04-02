// Proxy endpoint for Google Drive uploads to avoid CORS issues
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const driveUploadUrl = process.env.GOOGLE_DRIVE_UPLOAD_URL || process.env.REACT_APP_GOOGLE_DRIVE_UPLOAD_URL;
    
    if (!driveUploadUrl) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Drive upload URL not configured' 
      });
    }

    console.log('Proxying request to Google Drive:', driveUploadUrl);
    console.log('Payload size:', JSON.stringify(req.body).length, 'bytes');

    // Forward the request to Google Apps Script
    const response = await fetch(driveUploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const responseText = await response.text();
    console.log('Google Drive response status:', response.status);
    console.log('Google Drive response (first 500 chars):', responseText.substring(0, 500));

    // Parse and return the response
    try {
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        let errorHint = 'Check if the Google Apps Script is properly deployed as a Web App with access set to "Anyone".';
        
        if (responseText.includes('setHeader is not a function')) {
          errorHint = 'CRITICAL: The script code is outdated and contains the broken ".setHeader()" calls. Replace the script code with the "Minimal Working" version.';
        } else if (responseText.includes('Authorization required') || responseText.includes('Login')) {
          errorHint = 'The script requires authorization. Run it once in the Google Apps Script editor to grant permissions.';
        } else if (responseText.includes('Sorry, unable to open the file at present')) {
          errorHint = 'Google internal error or temporary lockout. Try again in a few minutes or recreate the deployment.';
        }

        res.status(500).json({
          success: false,
          error: 'Google Apps Script returned HTML instead of JSON',
          hint: errorHint,
          details: responseText.substring(0, 500)
        });
        return;
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
      res.status(response.ok ? 200 : 500).json(data);
    } catch (parseError) {
      console.error('Failed to parse Google Drive response:', parseError);
      res.status(500).json({
        success: false,
        error: 'Invalid response format from Google Drive',
        details: responseText.substring(0, 1000),
        hint: 'Check if the Google Apps Script is properly deployed and the URL is correct'
      });
    }

  } catch (error) {
    console.error('Drive upload proxy error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
