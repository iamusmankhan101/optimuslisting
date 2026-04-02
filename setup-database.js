import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log('🚀 Setting up Neon database...\n');

  try {
    // Create property_listings table
    console.log('Creating property_listings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS property_listings (
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
        property_images TEXT,
        documents TEXT,
        agent_code VARCHAR(100),
        agent_name VARCHAR(255),
        agent_mobile VARCHAR(50),
        agent_email VARCHAR(255),
        agent_agency VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ property_listings table created\n');

    // Create comments table
    console.log('Creating comments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        property_listing_id INTEGER REFERENCES property_listings(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ comments table created\n');

    // Create indexes
    console.log('Creating indexes...');
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_property_listings_email ON property_listings(email)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_property_listings_property_code ON property_listings(property_code)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_property_listings_emirate ON property_listings(emirate)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_property_listings_created_at ON property_listings(created_at)`;
      
      // Check if column exists before creating index
      const columnCheck = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'comments' AND column_name = 'property_listing_id'
      `;
      
      if (columnCheck.length > 0) {
        await sql`CREATE INDEX IF NOT EXISTS idx_comments_property_listing_id ON comments(property_listing_id)`;
      }
      console.log('✅ Indexes created\n');
    } catch (err) {
      console.log('⚠️  Some indexes may already exist or have issues:', err.message);
    }

    // Verify tables
    console.log('Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    console.log('📋 Tables in database:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    console.log('\n✨ Database setup complete!');
    console.log('\n🎉 You can now:');
    console.log('   1. Start your frontend: cd frontend && npm start');
    console.log('   2. Deploy to Vercel: vercel --prod');
    console.log('   3. Test the comments feature at /comments or in property details\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
