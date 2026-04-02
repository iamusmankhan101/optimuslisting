# Buyer Form Deployment Checklist

## 1. Database Setup

First, create the buyer_requirements table in your Neon database:

```bash
node setup-buyer-table.cjs
```

Or run this SQL directly in Neon console:

```sql
CREATE TABLE IF NOT EXISTS buyer_requirements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    emirate VARCHAR(100) NOT NULL,
    preferred_areas TEXT,
    bedrooms VARCHAR(50) NOT NULL,
    bathrooms VARCHAR(50) NOT NULL,
    min_size_sqft VARCHAR(50),
    max_size_sqft VARCHAR(50),
    maid_room VARCHAR(50),
    furnishing VARCHAR(100),
    min_budget VARCHAR(100) NOT NULL,
    max_budget VARCHAR(100) NOT NULL,
    payment_method VARCHAR(100),
    additional_requirements TEXT,
    status VARCHAR(50) DEFAULT 'New',
    assigned_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buyer_requirements_email ON buyer_requirements(email);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_emirate ON buyer_requirements(emirate);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_status ON buyer_requirements(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_created_at ON buyer_requirements(created_at);
```

## 2. Verify Environment Variables

Make sure these are set in Vercel:

- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `GOOGLE_SHEETS_URL` (optional) - For Google Sheets integration

## 3. Deploy to Vercel

```bash
git add .
git commit -m "Add buyer requirements feature"
git push
```

Vercel will automatically deploy.

## 4. Test the Deployment

### Test Buyer Form:
1. Visit: `https://yourdomain.vercel.app/buyer`
2. Fill out the form
3. Submit and check if it works

### Test Admin View:
1. Visit: `https://yourdomain.vercel.app/admin/buyers`
2. Check if buyer requirements are displayed

## 5. Troubleshooting

### If you get 500 errors:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Functions" tab
   - Check logs for errors

2. **Common Issues:**

   **Issue: "invalid input syntax for type integer: Studio"**
   - Solution: Already fixed in `api/match-properties.js` with regex check

   **Issue: "column does not exist"**
   - Solution: Run the database setup SQL above

   **Issue: "DATABASE_URL not defined"**
   - Solution: Add environment variable in Vercel settings

3. **Test API Endpoints Directly:**

   Test buyer requirements submission:
   ```bash
   curl -X POST https://yourdomain.vercel.app/api/buyer-requirements \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+971501234567",
       "purpose": "Buy",
       "category": "Residential",
       "sub_category": "Villa",
       "emirate": "Dubai",
       "bedrooms": "3",
       "bathrooms": "2",
       "min_budget": "2000000",
       "max_budget": "3000000"
     }'
   ```

   Test property matching:
   ```bash
   curl -X POST https://yourdomain.vercel.app/api/match-properties \
     -H "Content-Type: application/json" \
     -d '{
       "purpose": "Buy",
       "emirate": "Dubai",
       "bedrooms": "3",
       "bathrooms": "2",
       "min_budget": "2000000",
       "max_budget": "3000000"
     }'
   ```

## 6. Files Deployed

Make sure these files are in your repository:

- ✅ `api/buyer-requirements.js` - Submit and fetch buyer requirements
- ✅ `api/match-properties.js` - Match properties with buyer requirements
- ✅ `frontend/src/components/BuyerForm.js` - Buyer form component
- ✅ `frontend/src/components/BuyerRequirements.js` - Admin view component
- ✅ `frontend/src/components/MatchingProperties.js` - Results display
- ✅ `neon-schema.sql` - Database schema

## 7. Routes

After deployment, these routes should work:

- `/buyer` - Buyer requirements form (public)
- `/admin/buyers` - Admin view of buyer requirements
- `/api/buyer-requirements` - API endpoint (POST & GET)
- `/api/match-properties` - API endpoint (POST)

## 8. Quick Fix for Common Deployment Issues

If the buyer form doesn't work on Vercel:

1. **Check if table exists:**
   - Log into Neon console
   - Run: `SELECT * FROM buyer_requirements LIMIT 1;`
   - If error, create the table using SQL above

2. **Check API endpoint:**
   - Visit: `https://yourdomain.vercel.app/api/buyer-requirements`
   - Should return: `{"error":"Method not allowed"}` (this is correct for GET without data)

3. **Check Vercel logs:**
   - Vercel Dashboard → Your Project → Functions
   - Look for errors in `buyer-requirements` and `match-properties` functions

## 9. Success Indicators

✅ Buyer form submits successfully
✅ Matching properties are displayed after submission
✅ Admin page shows buyer requirements in table
✅ No console errors in browser
✅ Vercel function logs show successful executions

## 10. Next Steps After Deployment

1. Test the buyer form with real data
2. Check admin page to see submissions
3. Test property matching with existing listings
4. Monitor Vercel function logs for any errors
5. Set up email notifications (optional)
