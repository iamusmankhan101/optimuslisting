# Vercel Environment Variables Setup

## Required Environment Variables for Production

Go to your Vercel Dashboard → Project Settings → Environment Variables and add these:

### 1. Database Connection
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_MYOv4EmW1izG@ep-nameless-moon-adwdvlc5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development
```

### 2. Google Sheets Webhook
```
Name: GOOGLE_SHEET_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbyYxNE0XzlLtmgUbEGKf28hpMkwskvisB4xbbQXx47mO6mxmyuN9p3qEjRu5GB5c6c_/exec
Environment: Production, Preview, Development
```

### 3. Google Drive Upload (Optional)
```
Name: REACT_APP_GOOGLE_DRIVE_UPLOAD_URL
Value: https://script.google.com/macros/s/AKfycbwF1l1H9wOgI3fX3n6D9C6BU0eW87GCbJ_8zO75VDXG7-b1K1-E1lczpI3haXimD1G5/exec
Environment: Production, Preview, Development
```

## How to Add Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project: **listing.theoptimus.ae**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. For each variable:
   - Click **Add New**
   - Enter the **Name**
   - Enter the **Value**
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

## After Adding Variables

Redeploy your application:

```bash
vercel --prod
```

Or trigger a redeploy from Vercel Dashboard:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**

## Verify Environment Variables

After deployment, check if variables are set:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Environment Variables** to see what's loaded

## Testing

After redeployment:
1. Go to https://listing.theoptimus.ae
2. Fill out the form
3. Upload some test files
4. Submit
5. Check:
   - ✅ Data saved to Neon database
   - ✅ Data synced to Google Sheets
   - ✅ Files uploaded to Google Drive (if configured)

## Troubleshooting

### Form submission fails
- Check Vercel Function Logs for errors
- Verify DATABASE_URL is correct
- Test database connection

### Google Sheets not syncing
- Verify GOOGLE_SHEET_WEBHOOK_URL is correct
- Test the webhook URL directly
- Check Apps Script execution logs

### Files not uploading to Drive
- Verify REACT_APP_GOOGLE_DRIVE_UPLOAD_URL is set
- Check Apps Script is deployed and accessible
- Look at browser console for errors

### How to View Logs

1. Go to Vercel Dashboard
2. Click your project
3. Click **Deployments**
4. Click on a deployment
5. Click **Functions** tab
6. Click on a function to see logs

## Quick Test Commands

Test your API endpoints:

```bash
# Test get endpoint
curl https://listing.theoptimus.ae/api/get

# Test submit endpoint
curl -X POST https://listing.theoptimus.ae/api/submit \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","property_code":"TEST-001"}'
```

## Environment Variable Priority

1. Vercel Environment Variables (Production)
2. `.env.local` (Local development only)
3. `.env` (Fallback)

Note: `.env.local` files are NOT deployed to Vercel. You must set variables in Vercel Dashboard.
