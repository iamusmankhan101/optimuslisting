# Buyer Requirements Form Setup

## Overview
A new form has been created for buyers to submit their property requirements including budget, location, size, and other preferences.

## What's Been Created

### 1. Frontend Components
- **BuyerForm.js** - Main form for buyers to submit requirements
  - Contact information (name, email, phone)
  - Property type (purpose, category, sub-category)
  - Location preferences (emirate, preferred areas)
  - Property specifications (bedrooms, bathrooms, size range, maid room, furnishing)
  - Budget (min/max budget, payment method, move-in date)
  - Additional requirements

- **BuyerRequirements.js** - Admin view to see all buyer requirements
  - Grid view of all submissions
  - Modal popup with full details
  - Status tracking

### 2. Backend API
- **api/buyer-requirements.js**
  - POST: Submit new buyer requirements
  - GET: Fetch all buyer requirements for admin
  - Integrates with Neon PostgreSQL database
  - Optional Google Sheets logging

### 3. Database
- **buyer_requirements table** added to neon-schema.sql
  - All buyer requirement fields
  - Status tracking (New, In Progress, Matched, etc.)
  - Assigned agent tracking
  - Timestamps for created/updated

### 4. Routes
- `/buyer` - Buyer requirements form (public)
- `/admin/buyers` - Admin view of buyer requirements

## Setup Instructions

### 1. Create Database Table
Run the setup script to create the buyer_requirements table:

```bash
node setup-buyer-table.js
```

This will:
- Create the buyer_requirements table
- Add necessary indexes
- Verify the setup

### 2. Update Google Sheets (Optional)
If you want to log buyer requirements to Google Sheets, update your Google Apps Script to handle the "BuyerRequirements" sheet:

```javascript
// Add this to your google-apps-script.js
if (sheet === 'BuyerRequirements') {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Purpose', 'Category', 'Sub Category', 
                   'Emirate', 'Preferred Areas', 'Bedrooms', 'Bathrooms', 
                   'Min Size', 'Max Size', 'Maid Room', 'Furnishing',
                   'Min Budget', 'Max Budget', 'Payment Method', 'Move-in Date',
                   'Additional Requirements', 'Status', 'Created At'];
  // ... rest of the sheet handling code
}
```

### 3. Test the Form

#### Test Buyer Form Submission:
1. Navigate to `http://localhost:3000/buyer`
2. Fill out the form with test data
3. Submit and verify success message

#### Test Admin View:
1. Navigate to `http://localhost:3000/admin/buyers`
2. Verify buyer requirements are displayed
3. Click on a requirement to see full details

## Form Fields

### Required Fields
- Name
- Email
- Phone
- Purpose (Rent/Buy)
- Category (Residential/Commercial)
- Sub Category (Apartment, Villa, etc.)
- Emirate
- Bedrooms
- Bathrooms
- Min Budget
- Max Budget

### Optional Fields
- Preferred Areas
- Size Range (min/max sq.ft)
- Maid Room preference
- Furnishing preference
- Payment Method
- Move-in Date
- Additional Requirements

## Navigation

The admin sidebar now includes:
- Dashboard
- Property Leads (existing property listings)
- Buyer Requirements (new)

## Database Schema

```sql
CREATE TABLE buyer_requirements (
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
    move_in_date DATE,
    additional_requirements TEXT,
    status VARCHAR(50) DEFAULT 'New',
    assigned_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

1. Run `node setup-buyer-table.js` to create the database table
2. Test the form at `/buyer`
3. View submissions at `/admin/buyers`
4. Optionally configure Google Sheets integration
5. Deploy to Vercel (the API endpoint will work automatically)

## Features

- Clean, user-friendly form interface
- Reuses existing styling from MultiStepForm
- Budget range with currency formatting
- Date picker for move-in date
- Admin view with modal details
- Status tracking for follow-up
- Mobile responsive design
