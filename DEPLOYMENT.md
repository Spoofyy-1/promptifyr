# 🚀 Deployment Guide

This guide covers deploying Promptifyr to production using Railway (backend) and Vercel (frontend).

## 📋 Pre-deployment Checklist

- [ ] Code has been cleaned and tested
- [ ] Environment variables are properly configured
- [ ] Database is set up (MongoDB Atlas recommended for production)
- [ ] OpenAI API key is valid and has sufficient credits
- [ ] All sensitive information is removed from code

## 🚢 Backend Deployment (Railway)

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub with the latest changes.

### 2. Create Railway Account

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 3. Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `promptifyr` repository
3. Railway will auto-detect the backend
4. Set the following environment variables in Railway dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/promptifyr
JWT_SECRET=your-super-strong-production-jwt-secret-32-chars-minimum
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=https://your-frontend-domain.vercel.app
RATE_LIMIT_MAX=1000
```

### 4. Configure Build Settings

Railway should automatically detect the build settings from `railway.json`, but verify:
- **Build Command**: `cd backend && npm ci && npm run build`
- **Start Command**: `cd backend && npm start`

### 5. Custom Domain (Optional)

1. Go to your Railway project settings
2. Add a custom domain if desired
3. Update CORS_ORIGIN in other services

## 🌐 Frontend Deployment (Vercel)

### 1. Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2. Deploy Frontend

1. Click "New Project"
2. Import your `promptifyr` repository
3. Vercel will auto-detect React app
4. Configure build settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Output Directory**: `frontend/build`

### 3. Environment Variables

Set these in Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
REACT_APP_APP_NAME=Promptifyr
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

### 4. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Add your custom domain
3. Update CORS_ORIGIN in Railway backend

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Visit [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster

### 2. Configure Database

1. Create a database user
2. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific ranges)
3. Get connection string
4. Update `MONGODB_URI` in Railway

### 3. Seed Production Database

```bash
# Temporarily set production MongoDB URI in local .env
MONGODB_URI=your-production-mongodb-uri npm run seed
```

## 🔐 Security Checklist

- [ ] All environment variables are set correctly
- [ ] API keys are not exposed in code
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] MongoDB has proper authentication
- [ ] JWT secrets are strong (32+ characters)

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

1. **Railway**: Auto-deploys on push to `main` branch
2. **Vercel**: Auto-deploys on push to `main` branch

To configure different branches:
1. Go to project settings
2. Change production branch if needed
3. Set up preview deployments for other branches

## 🔍 Monitoring and Logs

### Railway Logs
- Go to your Railway project
- Click on the "Deployments" tab
- View real-time logs

### Vercel Logs
- Go to your Vercel project
- Click on "Functions" tab
- View deployment and runtime logs

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check package.json scripts
   - Verify Node.js version compatibility
   - Check for missing dependencies

2. **Environment Variables**
   - Ensure all required vars are set
   - Check variable names (case-sensitive)
   - Restart services after changes

3. **CORS Errors**
   - Verify CORS_ORIGIN matches frontend URL
   - Check for trailing slashes
   - Ensure HTTPS is used in production

4. **Database Connection**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

### Health Checks

Test your deployment:

1. **Backend Health**: Visit `https://your-backend.railway.app/api/health`
2. **Frontend**: Visit your Vercel domain
3. **Full Flow**: Register, login, attempt a challenge

## 📈 Performance Optimization

1. **Backend**
   - Enable compression (already configured)
   - Use connection pooling (already configured)
   - Monitor memory usage in Railway

2. **Frontend**
   - Built with production optimizations
   - Bundle analysis: `npm run analyze`
   - Monitor Core Web Vitals in Vercel

## 🔄 Updates and Maintenance

1. **Code Updates**: Push to main branch for auto-deployment
2. **Dependencies**: Update packages regularly
3. **Security**: Monitor for security advisories
4. **Database**: Regular backups via MongoDB Atlas
5. **Monitoring**: Set up alerts for downtime

## 🆘 Emergency Rollback

### Railway
1. Go to deployments
2. Click on previous successful deployment
3. Click "Redeploy"

### Vercel
1. Go to deployments
2. Find previous deployment
3. Click "Promote to Production" 