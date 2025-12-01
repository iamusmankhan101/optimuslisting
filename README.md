# Property Listing Application

A full-stack property listing management system with React frontend and serverless backend using Neon database.

## Setup Instructions

### Database Setup (Neon)

Follow the detailed guide in [NEON_SETUP.md](NEON_SETUP.md) to:
1. Create a Neon account
2. Create a database
3. Get your connection string
4. Set up the schema

### Backend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Update `backend/.env` with your Neon credentials:
   ```
   DATABASE_URL=postgresql://user:password@host/database
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## Features

- **Comprehensive Property Listing Form** with 5 sections:
  - Property Classification (Category, Sub Category, Purpose)
  - Property Identification (Location details, Google Pin)
  - Property Specifications (Bedrooms, Bathrooms, Size, Furnishing)
  - Sales/Rent Details (Pricing, Commission, Payment terms)
  - Viewing Status & Agent Details
- View all property listings in a searchable table
- Search/filter by property code, emirate, area, building, or agent
- Sort by any column
- View detailed property information in modal
- Responsive design

## API Endpoints

- `POST /backend/submit.php` - Submit property listing
- `GET /backend/get.php` - Get listings with optional search and sorting
