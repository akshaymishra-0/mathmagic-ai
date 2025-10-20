# 🚀 Complete Deployment Guide for MathMagic AI

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [API Key Setup](#api-key-setup)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Testing Deployment](#testing-deployment)
- [Troubleshooting](#troubleshooting)
- [Post-Deployment Tasks](#post-deployment-tasks)

---

## 📋 Prerequisites

### Required Accounts
1. **GitHub Account**: Your code repository
2. **Vercel Account**: For frontend hosting ([vercel.com](https://vercel.com))
3. **Render Account**: For backend hosting ([render.com](https://render.com))
4. **MongoDB Atlas Account**: For database ([mongodb.com/atlas](https://mongodb.com/atlas))
5. **OpenRouter Account**: For AI API ([openrouter.ai](https://openrouter.ai))

### System Requirements
- Node.js 18+ installed locally
- Git repository with your code
- Basic knowledge of terminal commands

---

## 🗄️ Database Setup

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Click **"Try Free"** or **"Sign In"**
3. Choose your plan (free tier is sufficient for testing)
4. Select **"Build a Database"**
5. Choose **"M0 Cluster"** (free tier)
6. Select your cloud provider and region (choose closest to your users)
7. Click **"Create Cluster"**

### Step 2: Set Up Database User
1. In your cluster dashboard, go to **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `mathmagic_user`
5. Generate a strong password or use a password generator
6. Set user privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development/testing: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add your Render service IP (you'll get this after deployment)
5. Click **"Confirm"**

### Step 4: Get Connection String
1. Go to **"Clusters"** and click **"Connect"**
2. Choose **"Connect your application"**
3. Select **"Node.js"** as driver
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with `mathmagic_prod`

**Your connection string should look like:**
```
mongodb+srv://mathmagic_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mathmagic_prod?retryWrites=true&w=majority
```

### Automatic Database Cleanup
The application includes **automatic cleanup** to manage storage on free MongoDB Atlas clusters:
- **Maintains 1000 most recent calculations** globally
- **Automatically deletes older entries** when limit is exceeded
- **Cleans up user references** to maintain data integrity
- **Runs in background** to avoid impacting performance
- **Helps stay within 512MB free tier limits**

---

## 🔑 API Key Setup

### OpenRouter API Key
1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Go to **"Keys"** in your dashboard
4. Click **"Create Key"**
5. Give it a name like "MathMagic Production"
6. Copy the API key (starts with `sk-or-v1-...`)
7. **Important**: Keep this key secure and never commit it to code

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect Repository
1. Go to [Vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository (`mathmagic--ai`)
4. Configure project settings:
   - **Name**: `mathmagic-ai` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)

### Step 2: Initial Deployment
1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://mathmagic-ai.vercel.app`
4. **Copy this URL** - you'll need it for the backend CORS configuration

### Step 3: Verify Frontend Deployment
1. Visit your Vercel URL
2. The app should load (though it won't work fully until backend is connected)
3. Check the browser console for any errors

---

## ⚙️ Backend Deployment (Render)

### Step 1: Connect Repository
1. Go to [Render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service settings:
   - **Name**: `mathmagic-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`

### Step 2: Configure Build & Start Commands
- **Build Command**: Leave empty (or `npm install`)
- **Start Command**: `npm start`

### Step 3: Initial Deployment
1. Click **"Create Web Service"**
2. Wait for deployment (usually 5-10 minutes)
3. Once deployed, you'll get a URL like: `https://mathmagic-backend.onrender.com`
4. **Copy this URL** - you'll need it for the frontend configuration

### Step 4: Verify Backend Deployment
1. Visit `https://your-render-url.onrender.com/health`
2. You should see a JSON response with status "OK"

---

## 🔧 Environment Variables Configuration

### Frontend Environment Variables (Vercel)
1. In your Vercel dashboard, go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add the following variable:
   ```
   Key: VITE_BACKEND_URL
   Value: https://your-render-backend.onrender.com
   Environment: Production
   ```
5. Click **"Save"**
6. **Redeploy** the frontend to apply changes

### Backend Environment Variables (Render)
1. In your Render dashboard, go to your backend service
2. Click **"Environment"** tab
3. Add the following variables:

   **Required Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   MONGODB_URI=mongodb+srv://mathmagic_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mathmagic_prod?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_random_string_here
   AI_PROVIDER=openrouter
   API_KEY=sk-or-v1-your-openrouter-key-here
   MODEL_NAME=alibaba/tongyi-deepresearch-30b-a3b:free
   ```

   **How to generate JWT_SECRET:**
   - Use a secure random string generator
   - Or run this command in terminal: `openssl rand -hex 32`

4. Click **"Save Changes"**
5. **Redeploy** the backend to apply changes

---

## 🧪 Testing Deployment

### Step 1: Test Health Endpoints
1. **Backend Health**: Visit `https://your-render-backend.onrender.com/health`
2. **Frontend Load**: Visit your Vercel URL

### Step 2: Test User Registration
1. Go to your Vercel frontend URL
2. Try to create a new account
3. Check if the registration works

### Step 3: Test Math Solving
1. Log in with your test account
2. Try solving a math problem
3. Verify that:
   - AI responds with step-by-step solution
   - Graphs display if applicable
   - No CORS errors in browser console

### Step 4: Test Database Connection
1. Check your MongoDB Atlas dashboard
2. Verify that user accounts and calculations are being saved

---

## 🔍 Troubleshooting

### Common Issues

#### ❌ CORS Errors
**Problem**: Browser shows CORS-related errors
**Solution**:
- Check that `FRONTEND_URL` in Render matches your Vercel URL exactly
- Ensure Vercel URL includes `https://`
- Redeploy backend after updating environment variables

#### ❌ API Key Errors
**Problem**: "API Key not configured" error
**Solution**:
- Verify `API_KEY` is set correctly in Render
- Check that your OpenRouter key is valid and has credits
- Ensure key starts with `sk-or-v1-`

#### ❌ Database Connection Errors
**Problem**: "MongoDB connection error"
**Solution**:
- Verify `MONGODB_URI` format and credentials
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

#### ❌ Build Failures
**Problem**: Deployment fails during build
**Solution**:
- Check build logs in Vercel/Render dashboards
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility

#### ❌ Environment Variables Not Working
**Problem**: App still uses old values
**Solution**:
- Always redeploy after changing environment variables
- Check variable names match exactly (case-sensitive)
- Verify variables are set for the correct environment

### Debug Commands

#### Check Backend Logs (Render)
1. Go to your Render service dashboard
2. Click **"Logs"** tab
3. Look for error messages and connection status

#### Check Frontend Logs (Vercel)
1. Go to your Vercel project dashboard
2. Click **"Functions"** or check deployment logs
3. Open browser developer tools (F12) → Console tab

#### Test API Endpoints
```bash
# Test health endpoint
curl https://your-render-backend.onrender.com/health

# Test with authentication (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" https://your-render-backend.onrender.com/api/auth/profile
```

---

## 📝 Post-Deployment Tasks

### Security Hardening
1. **Update MongoDB Network Access**:
   - Remove "Allow Access from Anywhere"
   - Add your Render service's static IP
   - Find your Render IP in the service settings

2. **Rotate API Keys**:
   - Generate new OpenRouter key for production
   - Update environment variables
   - Delete old keys

3. **Set Up Monitoring**:
   - Enable Render service monitoring
   - Set up uptime monitoring for your endpoints
   - Configure error alerting

### Performance Optimization
1. **Enable Caching**:
   - Consider Redis for session storage (future enhancement)
   - Implement response caching for AI calls

2. **Database Indexing**:
   - Add indexes on frequently queried fields
   - Monitor slow queries in MongoDB Atlas

### Backup Strategy
1. **Database Backups**:
   - Configure automated backups in MongoDB Atlas
   - Test backup restoration process

2. **Code Backups**:
   - Keep deployment branches stable
   - Use Git tags for releases

---

## 🎉 Deployment Complete!

Once all steps are completed successfully:

1. ✅ Database is connected
2. ✅ API keys are configured
3. ✅ Frontend is deployed and accessible
4. ✅ Backend is deployed and responding
5. ✅ Environment variables are set correctly
6. ✅ User registration and login work
7. ✅ Math solving functionality works
8. ✅ No CORS or connection errors

Your MathMagic AI application is now live and ready for users!

### Next Steps
- Share your Vercel URL with users
- Monitor usage and performance
- Consider adding analytics
- Plan for scaling as user base grows

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in Vercel/Render dashboards
3. Test individual components (database, API, frontend)
4. Check browser developer console for errors

**Happy deploying! 🚀**