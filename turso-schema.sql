-- Turso Database Schema for Property Listings
-- Run this in your Turso database shell: turso db shell property-listings

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email ON property_listings(email);
CREATE INDEX IF NOT EXISTS idx_property_code ON property_listings(property_code);
CREATE INDEX IF NOT EXISTS idx_emirate ON property_listings(emirate);
CREATE INDEX IF NOT EXISTS idx_created_at ON property_listings(created_at);
