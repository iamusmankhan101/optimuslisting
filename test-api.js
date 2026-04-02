import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function testAPI() {
  console.log('🧪 Testing Neon Database Connection...\n');

  try {
    // Test 1: Check tables exist
    console.log('Test 1: Checking tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables found:', tables.map(t => t.table_name).join(', '));

    // Test 2: Insert a test property listing
    console.log('\nTest 2: Inserting test property listing...');
    const [listing] = await sql`
      INSERT INTO property_listings (
        email, property_code, emirate, area_community, 
        building_name, purpose, bedrooms, bathrooms
      ) VALUES (
        'test@example.com', 'TEST-001', 'Dubai', 'Downtown',
        'Test Building', 'Sale', '2', '2'
      ) RETURNING id, property_code
    `;
    console.log('✅ Property listing created:', listing);

    // Test 3: Insert a test comment
    console.log('\nTest 3: Inserting test comment...');
    const [comment] = await sql`
      INSERT INTO comments (
        property_listing_id, comment, created_by
      ) VALUES (
        ${listing.id}, 'This is a test comment!', 'Test User'
      ) RETURNING id, comment
    `;
    console.log('✅ Comment created:', comment);

    // Test 4: Fetch property with comments
    console.log('\nTest 4: Fetching property listings...');
    const listings = await sql`
      SELECT * FROM property_listings 
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    console.log(`✅ Found ${listings.length} property listing(s)`);

    // Test 5: Fetch comments
    console.log('\nTest 5: Fetching comments...');
    const comments = await sql`
      SELECT * FROM comments 
      WHERE property_listing_id = ${listing.id}
    `;
    console.log(`✅ Found ${comments.length} comment(s) for property ${listing.property_code}`);

    // Test 6: Clean up test data
    console.log('\nTest 6: Cleaning up test data...');
    await sql`DELETE FROM comments WHERE property_listing_id = ${listing.id}`;
    await sql`DELETE FROM property_listings WHERE id = ${listing.id}`;
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Your database is ready to use.\n');
    console.log('Next steps:');
    console.log('  1. cd frontend && npm start');
    console.log('  2. Visit http://localhost:3000');
    console.log('  3. Submit a property listing');
    console.log('  4. View it and add comments!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAPI();
