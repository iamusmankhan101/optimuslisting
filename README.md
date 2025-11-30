# Form Application

A full-stack form application with React frontend and PHP backend.

## Setup Instructions

### Backend Setup

1. Import the database:
   ```
   mysql -u root -p < backend/setup.sql
   ```

2. Update database credentials in `backend/config.php` if needed

3. Place the `backend` folder in your web server directory (e.g., `htdocs` for XAMPP)

4. Ensure your PHP server is running on `http://localhost`

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

- Comprehensive property listing form with 5 sections:
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
