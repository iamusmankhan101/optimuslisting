# Deploy Backend Separately

## Option 1: Create New Vercel Project for API

### 1. Create a new folder for backend API:
```bash
mkdir property-api
cd property-api
```

### 2. Copy API files:
```bash
# Copy from your current project
cp -r ../api .
cp ../package.json .
cp ../package-lock.json .
```

### 3. Create vercel.json for API:
```json
{
  "version": 2,
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### 4. Initialize git and deploy:
```bash
git init
git add .
git commit -m "Initial API deployment"
vercel
```

### 5. Set environment variables in Vercel:
- `DATABASE_URL`: Your Neon connection string

### 6. Get your API URL:
After deployment, you'll get a URL like: `https://property-api.vercel.app`

## Option 2: Use Railway (Easier!)

Railway is simpler for backend APIs:

### 1. Go to https://railway.app
### 2. Sign up with GitHub
### 3. Click "New Project" → "Deploy from GitHub repo"
### 4. Select your repository
### 5. Set Root Directory to `/` 
### 6. Add environment variables:
   - `DATABASE_URL`: Your Neon connection string
   - `PORT`: 8001

### 7. Railway will auto-deploy
You'll get a URL like: `https://your-app.railway.app`

## Step 3: Update Frontend to Use Backend URL

Once you have the backend URL, update your frontend:

### In `.env.local` (for local development):
```
REACT_APP_API_URL=http://localhost:8001
```

### In Vercel Environment Variables (for production):
Add: `REACT_APP_API_URL=https://your-backend-url.vercel.app`

Or: `REACT_APP_API_URL=https://your-app.railway.app`

## Step 4: Redeploy Frontend

```bash
git add .
git commit -m "Update API URL"
git push
```

## Recommended: Use Railway for Backend

Railway is better for backend APIs because:
- ✅ Simpler configuration
- ✅ Better for Node.js servers
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ Better logging

## Quick Railway Setup:

1. **Push your code to GitHub** (if not already)
2. **Go to railway.app** and sign in with GitHub
3. **New Project** → **Deploy from GitHub**
4. **Select your repo**
5. **Add environment variable**: `DATABASE_URL`
6. **Deploy!**

Railway will give you a URL like: `https://property-form-production.up.railway.app`

Then update your frontend's `REACT_APP_API_URL` to point to this Railway URL.

## Testing

After deployment:

1. **Test API**: Visit `https://your-backend-url/api/health`
2. **Test buyer form**: Submit a requirement
3. **Check admin**: View in `/admin/buyers`

Done! Your backend and frontend are now deployed separately and working together.
