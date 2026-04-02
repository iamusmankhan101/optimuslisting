# Neon PostgreSQL Setup

## Step 1: Create Neon Database

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:password@host/dbname`)

## Step 2: Create Database Table

Run this SQL in your Neon dashboard:

```sql
CREATE TABLE property_listings (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    source_of_listing VARCHAR(255),
    category VARCHAR(100),
    sub_category VARCHAR(100),
    purpose VARCHAR(50),
    property_code VARCHAR(100),
    emirate VARCHAR(100),
    area_community VARCHAR(255),
    building_name VARCHAR(255),
    unit_number VARCHAR(100),
    google_pin TEXT,
    bedrooms VARCHAR(50),
    bathrooms VARCHAR(50),
    size_sqft VARCHAR(50),
    maid_room VARCHAR(10),
    furnishing VARCHAR(100),
    property_condition VARCHAR(100),
    sale_price VARCHAR(100),
    unit_status VARCHAR(100),
    rented_details TEXT,
    notice_given VARCHAR(255),
    sales_agent_commission VARCHAR(100),
    asking_rent VARCHAR(100),
    number_of_chq VARCHAR(50),
    security_deposit VARCHAR(100),
    rent_agent_commission VARCHAR(100),
    keys_status VARCHAR(100),
    viewing_status VARCHAR(100),
    more_information TEXT,
    agent_code VARCHAR(100),
    agent_name VARCHAR(255),
    agent_mobile VARCHAR(50),
    agent_email VARCHAR(255),
    agent_agency VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 3: Add Environment Variable to Vercel

1. Go to your Vercel project settings
2. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: (your Neon connection string)
3. Redeploy

## Step 4: Install Dependencies

```powershell
npm install @neondatabase/serverless
```

Then push to GitHub and redeploy on Vercel.
