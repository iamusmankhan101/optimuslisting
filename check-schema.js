import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check comments table columns
    console.log('Comments table columns:');
    const commentsCols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'comments'
      ORDER BY ordinal_position
    `;
    console.table(commentsCols);

    // Check property_listings table columns
    console.log('\nProperty listings table columns (first 10):');
    const listingsCols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'property_listings'
      ORDER BY ordinal_position
      LIMIT 10
    `;
    console.table(listingsCols);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema();
