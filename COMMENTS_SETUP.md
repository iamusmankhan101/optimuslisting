# Comments Feature Setup Guide

The comments feature has been successfully integrated into your property listing application!

## What's Been Added

### API Endpoints
- **`/api/comments/create`** - POST endpoint to create new comments
- **`/api/comments/get`** - GET endpoint to fetch comments (optionally filtered by property_listing_id)

### React Components
- **`Comments.js`** - Reusable comment component with form and list
- **`Comments.css`** - Styling for the comments component

### Integration Points
1. **SubmissionsList** - Comments appear in the property details modal
2. **AdminJobs** - Comments appear in the lead details modal
3. **Standalone Route** - Available at `/comments` for general comments

## Database Schema

The comments table has been added to `neon-schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    property_listing_id INTEGER REFERENCES property_listings(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Steps

### 1. Create the Comments Table in Neon

Go to your Neon SQL Editor and run:

```sql
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    property_listing_id INTEGER REFERENCES property_listings(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_property_listing_id ON comments(property_listing_id);
```

### 2. Ensure Environment Variables

Make sure your `backend/.env` has:
```env
DATABASE_URL=postgresql://your-neon-connection-string
```

### 3. Deploy to Vercel

The API routes will automatically work on Vercel. Just make sure to add your `DATABASE_URL` environment variable in Vercel project settings.

## Usage

### In Property Details Modal
Comments are automatically shown when viewing property details in:
- `/leads` page (SubmissionsList)
- `/admin/leads` page (AdminJobs)

### Standalone Comments Page
Visit `/comments` to see a general comments section (not tied to any specific property).

### Programmatic Usage

```jsx
import Comments from './components/Comments';

// General comments
<Comments />

// Property-specific comments
<Comments propertyListingId={123} />
```

## Features

- ✅ Add comments with optional name
- ✅ View all comments in chronological order
- ✅ Link comments to specific properties
- ✅ Timestamps for each comment
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Real-time updates after submission

## API Examples

### Create a Comment
```bash
curl -X POST http://localhost:3000/api/comments/create \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is a great property!",
    "property_listing_id": 123,
    "created_by": "John Doe"
  }'
```

### Get All Comments
```bash
curl http://localhost:3000/api/comments/get
```

### Get Comments for a Specific Property
```bash
curl http://localhost:3000/api/comments/get?property_listing_id=123
```

## Testing Locally

1. Make sure your backend server is running (if using local development)
2. Navigate to any property listing and click "View"
3. Scroll down in the modal to see the comments section
4. Add a comment and see it appear immediately

## Troubleshooting

### Comments not showing up
- Check that the `comments` table exists in your database
- Verify `DATABASE_URL` is set correctly
- Check browser console for any errors

### API errors
- Ensure Neon database is accessible
- Check that the `@neondatabase/serverless` package is installed
- Verify the connection string format

### Styling issues
- Clear browser cache
- Check that `Comments.css` is being imported
- Verify no CSS conflicts with existing styles

## Future Enhancements

Potential features to add:
- Edit/delete comments
- Reply to comments (threading)
- User authentication
- Comment moderation
- Rich text formatting
- File attachments
- Email notifications
