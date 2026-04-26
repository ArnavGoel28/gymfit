# GymFit - Deployment Guide for Render

## Pre-Deployment Checklist

1. **Push to GitHub** (private or public repo)
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/yourusername/gymfit.git
   git push -u origin main
   ```

2. **Set up MongoDB Atlas** (Free Cloud Database)
   - Go to https://cloud.mongodb.com
   - Create a free M0 cluster (no credit card required)
   - Wait for cluster to deploy (~3 minutes)
   - Database Access → Add Database User
     - Username: `gymuser`
     - Password: (generate strong password, save it)
     - Database User Privileges: `Read and write to any database`
   - Network Access → Add IP Address
     - Click "Allow access from anywhere" (0.0.0.0/0) – for demo purposes
     - Or add specific IPs for security
   - Click "Connect" → "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://gymuser:<password>@cluster.mongodb.net/gymBD?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

## Deploy to Render

### Step 1: Create Render Account
- Sign up at https://render.com (GitHub/GitLab/Google sign-in available)

### Step 2: Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository (authorize Render)
3. Select the `gymfit` repository

### Step 3: Configure Service
- **Name:** `gymfit` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to you (e.g., Mumbai, Singapore)
- **Branch:** `main` (or your default branch)
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Plan:** Free (sleeps after 15 mins of inactivity)

### Step 4: Set Environment Variables
In Render Dashboard → Your Service → Environment tab, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://gymuser:YOUR_PASSWORD@cluster.mongodb.net/gymBD?retryWrites=true&w=majority` |
| `JWT_SECRET` | *(Generate a random string – e.g., `openssl rand -base64 64` or use any 32+ char random string)* |

**Generate JWT_SECRET:**
- Online: https://www.random.org/strings (64 chars, lowercase+uppercase+numbers)
- Or in terminal: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Step 5: Deploy
- Click "Create Web Service"
- Render will build and deploy automatically
- Wait 2-5 minutes
- Copy the URL (e.g., `https://gymfit.onrender.com`)

## Post-Deployment

1. **Open your deployed URL** in browser
2. **Register admin account** (select Administrator role)
3. **Test all features:**
   - Admin can view analytics
   - Members can book slots
   - Attendance marking works

3. **Enable Auto-Deploy** (optional):
   - Settings → Auto-Deploy → Enable
   - Every git push will trigger redeploy

## Troubleshooting

### Build fails with "Cannot find module"
- Ensure `package.json` has correct dependencies (express, mongoose, etc.)
- `npm install` command will install them automatically

### Database connection error
- Double-check `MONGODB_URI` in Render environment variables
- Ensure MongoDB Atlas cluster is running
- Check that IP 0.0.0.0/0 is whitelisted in Network Access

### App crashes after deployment
- Check Render logs (Logs tab)
- Common issue: Missing `dotenv` – already in dependencies
- Ensure `PORT` env var is set to `5000`

## Domain (Optional)

Render provides free `*.onrender.com` subdomain. To use custom domain:
1. Settings → Custom Domain → Add Domain
2. Update DNS with provided records
3. HTTPS auto-configured via Let's Encrypt

## Keep App Awake (Free Tier Limitation)

Render free tier sleeps after 15 minutes of inactivity. To prevent sleep:

1. **Use UptimeRobot** (free):
   - Sign up at https://uptimerobot.com
   - Add new monitor → HTTP(s)
   - URL: `https://gymfit.onrender.com`
   - Monitoring interval: 5 minutes
   - This keeps the app awake 24/7

2. **Or upgrade to paid plan** ($7/month)

---

**Your college project is now professionally deployed with zero server maintenance!**
