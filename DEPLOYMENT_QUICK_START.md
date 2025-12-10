# Frontend Deployment Quick Start

## ✅ Pre-Deployment Checklist

All setup is complete and ready for Netlify deployment:

- ✅ `frontend/.env.production` created with `VITE_API_URL`
- ✅ `frontend/.env.example` created for reference
- ✅ `vite.config.js` optimized for production builds
- ✅ `netlify.toml` configured with build settings and redirects
- ✅ Backend CORS updated to support production frontend
- ✅ Production build tested locally (successful)

## 🚀 Deploy to Netlify (3 Steps)

### Step 1: Connect Repository
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your `LMS-G2` repository

### Step 2: Configure Build
Use these exact settings:

```
Base directory:     frontend
Build command:      npm run build
Publish directory:  frontend/dist
Branch:             main (or your current branch)
```

### Step 3: Set Environment Variable
Click "Advanced" → "Add environment variable":

```
Key:    VITE_API_URL
Value:  https://lms-backend.onrender.com/api
```

**Note:** Replace `lms-backend.onrender.com` with your actual Render backend URL.

### Step 4: Deploy!
Click "Deploy site" and wait 2-4 minutes.

## 🔧 Post-Deployment

### Update Backend CORS
After getting your Netlify URL (e.g., `https://your-site.netlify.app`), add it to your backend environment variables on Render:

```
FRONTEND_URL=https://your-site.netlify.app
```

### Test Your Deployment
Visit your Netlify URL and verify:
- ✅ Site loads without errors
- ✅ Login/Register works
- ✅ Can view courses
- ✅ Can enroll in courses
- ✅ No CORS errors in browser console

### Default Test Account
```
Email:    student1@my.centennialcollege.ca
Password: password123
```

## 📝 Important URLs to Save

After deployment, document these URLs in your project:

```
Frontend:  https://[your-site].netlify.app
Backend:   https://[your-backend].onrender.com
Dashboard: https://app.netlify.com/sites/[your-site]
```

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "your changes"
git push origin main
```

## 📚 Full Documentation

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete details including:
- CLI deployment
- Troubleshooting
- Custom domains
- Performance optimization
- Security checklist

## ⚡ Need Help?

Common issues and solutions in the full deployment guide.
