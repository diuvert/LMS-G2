# Netlify Deployment Guide - LMS Frontend

## Prerequisites
1. Netlify account (https://netlify.com)
2. GitHub repository with latest code pushed
3. Backend deployed and running on Render: `https://lms-g2.onrender.com`

## Deployment Steps

### Option 1: Using Netlify Dashboard (Recommended)

#### 1. Sign in to Netlify
- Go to https://app.netlify.com
- Sign in with your GitHub account

#### 2. Create New Site
- Click "Add new site" → "Import an existing project"
- Choose "Deploy with GitHub"
- Authorize Netlify to access your GitHub repositories
- Select your repository: `diuvert/LMS-G2`

#### 3. Configure Build Settings
Set the following configuration:

**Site Configuration:**
- **Branch to deploy**: `deploy-setup-ss1010` (or `main`)
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

**Advanced settings:**

Click "Show advanced" and add environment variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://lms-g2.onrender.com/api`

#### 4. Deploy
- Click "Deploy site"
- Netlify will build and deploy your application
- Wait for the build to complete (2-4 minutes)
- You'll get a URL like: `https://random-name-123456.netlify.app`

#### 5. Update Site Name (Optional)
- Go to "Site settings" → "General" → "Site details"
- Click "Change site name"
- Choose a custom name like: `lms-g2` → `https://lms-g2.netlify.app`

### Option 2: Using Netlify CLI

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify
```bash
netlify login
```

#### 3. Initialize Site
```bash
cd frontend
netlify init
```

Follow the prompts:
- Create & configure a new site
- Select your team
- Choose site name
- Build command: `npm run build`
- Publish directory: `dist`

#### 4. Deploy
```bash
netlify deploy --prod
```

### Option 3: Using netlify.toml (Blueprint)

The repository already includes `netlify.toml` with proper configuration. When you connect your repository to Netlify, it will automatically detect and use these settings.

## Post-Deployment Configuration

### 1. Verify Environment Variables
In Netlify Dashboard:
- Go to "Site settings" → "Environment variables"
- Ensure `VITE_API_URL` is set to: `https://lms-g2.onrender.com/api`

### 2. Update Backend CORS (if needed)
If you get CORS errors, update your backend `src/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://lms-g2.netlify.app', // Your Netlify URL
  'https://your-custom-domain.com' // Any custom domain
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 3. Custom Domain (Optional)
- Go to "Domain settings" → "Add custom domain"
- Follow Netlify's instructions to configure DNS

## Verification

### Test Deployed Application

Once deployed, test these functionalities:

#### 1. Basic Functionality
- ✅ Site loads without errors
- ✅ Navigation works
- ✅ No mixed-content warnings (HTTP/HTTPS)

#### 2. Authentication
```
Test Login:
Email: student1@my.centennialcollege.ca
Password: password123

Test Register:
Create a new account with valid email
```

#### 3. Features
- ✅ Login/Register works
- ✅ Course list displays
- ✅ Enrollment functionality works
- ✅ Protected routes enforce authentication
- ✅ Role-based access works (Admin/Instructor/Student)

### Manual Testing Commands

```bash
# Test API connection from deployed frontend
# Open browser console on your Netlify URL and run:
fetch('https://lms-g2.onrender.com/api')
  .then(r => r.json())
  .then(console.log)
# Should return: {status: 'ok'}
```

## Build Locally First

Before deploying, test the production build locally:

```bash
cd frontend

# Build the app
npm run build

# Preview the production build
npm run preview
```

This will:
1. Build the app using production settings
2. Serve it locally on `http://localhost:4173`
3. Use the production API URL from `.env.production`

## Troubleshooting

### Build Fails

**Check Node Version:**
Netlify uses Node 18 by default. Add to `netlify.toml` if you need a specific version:

```toml
[build.environment]
  NODE_VERSION = "18"
```

**Missing Dependencies:**
Ensure all dependencies are in `package.json` (not devDependencies for build deps)

### CORS Errors

**Symptom:** Console shows "blocked by CORS policy"

**Solution:**
1. Verify backend CORS configuration includes your Netlify URL
2. Redeploy backend with updated CORS settings
3. Ensure API requests use HTTPS (not HTTP)

### 404 on Page Refresh

**Symptom:** Direct URL navigation or refresh gives 404

**Solution:** 
The `netlify.toml` file already includes SPA redirect rules:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still having issues, verify the file is at the repository root.

### Mixed Content Warnings

**Symptom:** "Mixed Content" errors in console

**Solution:**
- Ensure `VITE_API_URL` uses HTTPS: `https://lms-g2.onrender.com/api`
- Not HTTP: ~~`http://lms-g2.onrender.com/api`~~

### Environment Variables Not Working

**Check:**
1. Variable name starts with `VITE_` prefix
2. Variable is set in Netlify Dashboard under "Environment variables"
3. Redeploy after adding/changing environment variables

## Continuous Deployment

### Automatic Deploys

Netlify automatically deploys when you push to the connected branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "feat: update frontend"
   git push origin deploy-setup-ss1010
   ```
3. Netlify detects the changes and redeploys automatically
4. Monitor deployment in Netlify Dashboard

### Deploy Previews

For pull requests:
- Netlify creates a preview deployment
- Test changes before merging
- Preview URL provided in PR comments

### Deploy Hooks

Create webhook for manual deploys:
1. Go to "Site settings" → "Build & deploy" → "Build hooks"
2. Click "Add build hook"
3. Use the URL to trigger deploys programmatically

## Performance Optimization

### Enable Caching
Netlify automatically caches static assets. Verify in `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Asset Optimization
Vite automatically optimizes assets during build:
- Minification
- Tree-shaking
- Code splitting
- Image optimization

### Enable Compression
Netlify automatically serves gzip/brotli compressed assets.

## Monitoring

### View Logs
- Go to "Deploys" → Select a deploy → "Deploy log"
- Check for build errors or warnings

### Analytics
- Enable Netlify Analytics in "Site settings" → "Analytics"
- Monitor traffic, page views, and performance

### Error Tracking
Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

## Environment Variables Reference

| Variable | Description | Production Value |
|----------|-------------|------------------|
| `VITE_API_URL` | Backend API base URL | `https://lms-g2.onrender.com/api` |

## URLs to Document

After deployment, save these URLs:

- **Frontend URL**: `https://lms-g2.netlify.app` (or your custom name)
- **Backend URL**: `https://lms-g2.onrender.com`
- **Deployment Dashboard**: `https://app.netlify.com/sites/your-site-name`

## Security Checklist

- ✅ Environment variables set correctly
- ✅ HTTPS enforced (automatic with Netlify)
- ✅ Security headers configured in `netlify.toml`
- ✅ No API keys or secrets in frontend code
- ✅ CORS properly configured on backend
- ✅ Authentication tokens stored securely (localStorage)

## Next Steps

1. Deploy frontend to Netlify
2. Test all functionality
3. Update project README with deployment URLs
4. Configure custom domain (optional)
5. Set up monitoring and analytics
6. Document any environment-specific configurations

## Support Resources

- **Netlify Documentation**: https://docs.netlify.com
- **Vite Documentation**: https://vitejs.dev/guide/
- **Project Deployment Guide**: This file

---

**Deployment Checklist:**

- [ ] Backend deployed and running on Render
- [ ] Frontend code pushed to GitHub
- [ ] Environment variables configured
- [ ] netlify.toml file present
- [ ] Local production build tested
- [ ] Site created on Netlify
- [ ] Build settings configured
- [ ] Deployment successful
- [ ] All features tested on deployed site
- [ ] URLs documented
- [ ] CORS verified
- [ ] No console errors

---

**Estimated Deployment Time:**
- Site setup: 2-3 minutes
- Build & deploy: 2-4 minutes  
- Verification: 5-10 minutes
- **Total**: ~15 minutes
