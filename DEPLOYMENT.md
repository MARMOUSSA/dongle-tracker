# 🚀 Deployment Guide - DaVinci Dongle Tracker

## Quick Start (Render - Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: DaVinci Dongle Tracker"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/dongle-tracker.git
git push -u origin main
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click **"New Web Service"**
4. Connect your GitHub account and select the repository
5. Configure:
   - **Name**: `dongle-tracker`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click **"Create Web Service"**
7. Wait for deployment (2-3 minutes)
8. Your app will be live at: `https://dongle-tracker-XXXX.onrender.com`

## Alternative Options

### Railway (Also Free)
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys automatically
6. Live at: `https://YOUR_APP.up.railway.app`

### Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Heroku (Free tier available)
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create dongle-tracker-YOUR_NAME

# Deploy
git push heroku main
```

## Important Notes

### ✅ What's Included for Deployment:
- **Environment variables**: Server reads PORT from environment
- **Static files**: All frontend files served correctly
- **Data persistence**: JSON file storage works on all platforms
- **Dependencies**: All required packages in package.json
- **Start script**: Proper npm start command configured

### 🔧 Configuration Files:
- `render.yaml` - Render deployment config
- `package.json` - Dependencies and scripts
- `.gitignore` - Excludes node_modules and sensitive files
- `README.md` - Full documentation

### 📊 Expected Costs:
- **Render Free**: 750 hours/month (covers 24/7 usage)
- **Railway**: $5 credit/month (usually sufficient)
- **Vercel**: Unlimited for personal projects
- **Heroku**: Free tier with some limitations

### 🌐 After Deployment:
1. **Test the app**: Check all functionality works
2. **Share the URL**: Give the live URL to your team
3. **Monitor usage**: Most platforms provide basic analytics
4. **Custom domain** (optional): Add your own domain if needed

## Troubleshooting

### If deployment fails:
1. **Check logs** on your deployment platform
2. **Verify package.json** has all dependencies
3. **Ensure data directory exists** (handled by .gitkeep)
4. **Check Node.js version** compatibility

### Common issues:
- **Port binding**: App uses `process.env.PORT || 3000`
- **File paths**: All paths are relative and work in production
- **Data storage**: JSON file created automatically on first run

## Security Notes

- **No sensitive data**: App only stores dongle checkout info
- **HTTPS**: All platforms provide free SSL certificates
- **CORS**: Configured for web browser access
- **Input validation**: Basic validation on all inputs

Your app is now ready for free deployment! 🎉