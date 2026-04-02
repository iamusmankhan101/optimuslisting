import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function fixCommentsTable() {
  console.log('🔧 Fixing comments table...\n');

  try {
    // Drop the existing comments table
    console.log('Dropping old comments table...');
    await sql`DROP TABLE IF EXISTS comments CASCADE`;
    console.log('✅ Old table dropped\n');

    // Create the new comments table with all columns
    console.log('Creating new comments table...');
    await sql`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        property_listing_id INTEGER REFERENCES property_listings(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ New comments table created\n');

    // Create index
    console.log('Creating index...');
    await sql`CREATE INDEX idx_comments_property_listing_id ON comments(property_listing_id)`;
    console.log('✅ Index created\n');

    // Verify the new structure
    console.log('Verifying new structure:');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'comments'
      ORDER BY ordinal_position
    `;
    console.table(columns);

    console.log('\n✨ Comments table fixed successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCommentsTable();
