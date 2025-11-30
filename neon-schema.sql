-- Neon PostgreSQL Schema for Property Listings

CREATE TABLE IF NOT EXISTS property_listings (
    id SERIAL PRIMARY KEY,
    
    -- Basic Info
    email VARCHAR(255) NOT NULL,
    source_of_listing VARCHAR(255),
    
    -- Section 1: Property Classification
    category VARCHAR(100),
    sub_category VARCHAR(100),
    purpose VARCHAR(50),
    
    -- Section 2: Property Identification
    property_code VARCHAR(100),
    emirate VARCHAR(100),
    area_community VARCHAR(255),
    building_name VARCHAR(255),
    unit_number VARCHAR(100),
    google_pin TEXT,
    
    -- Section 3: Property Specifications
    bedrooms VARCHAR(50),
    bathrooms VARCHAR(50),
    size_sqft VARCHAR(50),
    maid_room VARCHAR(10),
    furnishing VARCHAR(100),
    property_condition VARCHAR(100),
    
    -- Sales Details
    sale_price VARCHAR(100),
    unit_status VARCHAR(100),
    rented_details TEXT,
    notice_given VARCHAR(255),
    sales_agent_commission VARCHAR(100),
    
    -- Rent Details
    asking_rent VARCHAR(100),
    number_of_chq VARCHAR(50),
    security_deposit VARCHAR(100),
    rent_agent_commission VARCHAR(100),
    
    -- Section 4: Viewing & Status
    keys_status VARCHAR(100),
    viewing_status VARCHAR(100),
    more_information TEXT,
    property_images TEXT,
    documents TEXT,
    
    -- Section 5: Agent Details
    agent_code VARCHAR(100),
    agent_name VARCHAR(255),
    agent_mobile VARCHAR(50),
    agent_email VARCHAR(255),
    agent_agency VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table for property listings
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    property_listing_id INTEGER REFERENCES property_listings(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_listings_email ON property_listings(email);
CREATE INDEX IF NOT EXISTS idx_property_listings_property_code ON property_listings(property_code);
CREATE INDEX IF NOT EXISTS idx_property_listings_emirate ON property_listings(emirate);
CREATE INDEX IF NOT EXISTS idx_property_listings_created_at ON property_listings(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_property_listing_id ON comments(property_listing_id);
