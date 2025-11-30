# Turso Database Setup Guide

This guide will help you set up Turso cloud database for your application.

## Prerequisites

- Node.js installed
- Turso CLI installed

## Step 1: Use Turso CLI via NPX (No Installation Required)

You can use Turso directly with npx without installing anything. Just prefix all commands with `npx @turso/cli`.

## Step 2: Sign Up and Login

```bash
npx @turso/cli auth signup
npx @turso/cli auth login
```

## Step 3: Create a Database

```bash
npx @turso/cli db create property-listings
```

## Step 4: Get Database URL and Auth Token

Get your database URL:
```bash
npx @turso/cli db show property-listings --url
```

Create an auth token:
```bash
npx @turso/cli db tokens create property-listings
```

## Step 5: Update Environment Variables

Add the following to your `backend/.env` file:

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

## Step 6: Create Database Schema

Connect to your Turso database:
```bash
npx @turso/cli db shell property-listings
```

Then run the following SQL to create the table:

```sql
CREATE TABLE IF NOT EXISTS property_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  source_of_listing TEXT,
  category TEXT,
  sub_category TEXT,
  purpose TEXT,
  property_code TEXT,
  emirate TEXT,
  area_community TEXT,
  building_name TEXT,
  unit_number TEXT,
  google_pin TEXT,
  bedrooms TEXT,
  bathrooms TEXT,
  size_sqft TEXT,
  maid_room TEXT,
  furnishing TEXT,
  property_condition TEXT,
  sale_price TEXT,
  unit_status TEXT,
  rented_details TEXT,
  notice_given TEXT,
  sales_agent_commission TEXT,
  asking_rent TEXT,
  number_of_chq TEXT,
  security_deposit TEXT,
  rent_agent_commission TEXT,
  keys_status TEXT,
  viewing_status TEXT,
  more_information TEXT,
  agent_code TEXT,
  agent_name TEXT,
  agent_mobile TEXT,
  agent_email TEXT,
  agent_agency TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Type `.exit` to exit the shell.

## Step 7: Install Dependencies

```bash
npm install @libsql/client
```

## Step 8: Deploy to Vercel

Make sure to add your environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `GOOGLE_SHEET_WEBHOOK_URL` (if using Google Sheets integration)

## Turso CLI Useful Commands

- List databases: `npx @turso/cli db list`
- Show database info: `npx @turso/cli db show property-listings`
- Access database shell: `npx @turso/cli db shell property-listings`
- Delete database: `npx @turso/cli db destroy property-listings`
- View database locations: `npx @turso/cli db locations`

## Benefits of Turso

- **Edge-ready**: Deploy your database close to your users
- **SQLite-compatible**: Use familiar SQLite syntax
- **Serverless**: No infrastructure to manage
- **Free tier**: Generous free tier for development
- **Fast**: Low latency with edge replication
- **Scalable**: Automatic scaling based on usage

## Troubleshooting

### Connection Issues
- Verify your `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Check if the database exists: `npx @turso/cli db list`
- Ensure the auth token is valid: `npx @turso/cli db tokens list property-listings`

### Schema Issues
- Verify the table was created: `npx @turso/cli db shell property-listings` then `SELECT * FROM property_listings LIMIT 1;`
- Check table structure: `.schema property_listings`

## Migration from Neon

The main differences from Neon PostgreSQL:

1. **Placeholders**: Use `?` instead of `$1, $2, etc.`
2. **Case sensitivity**: Use `LIKE` instead of `ILIKE` (SQLite is case-insensitive by default)
3. **Client**: Use `@libsql/client` instead of `@neondatabase/serverless`
4. **No connection pooling**: Turso handles connections automatically

All these changes have been applied to your `api/get.js` and `api/submit.js` files.
