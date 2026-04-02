@echo off
echo Testing Google Apps Script deployment...
echo URL: https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec

echo.
echo 1. Testing GET request...
curl -X GET "https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec" -H "Accept: application/json"

echo.
echo.
echo 2. Testing POST request...
curl -X POST "https://script.google.com/macros/s/AKfycbzKwSQCEJ1Bms5mMUsP93LR7cnupIr8XZoUC_N6FmD3Tt_d9JMmDeS6ALtjDxwRgkkt_w/exec" -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"property_code\":\"TEST-CURL\",\"property_images\":[],\"documents\":[]}"

echo.
echo Test completed!