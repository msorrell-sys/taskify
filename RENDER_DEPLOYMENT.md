# Render.com Deployment Guide

This guide walks through deploying Taskify to Render.com.

## Prerequisites

- GitHub account
- Render.com account (sign up at https://render.com)
- This repository pushed to GitHub

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
cd /Users/mike/taskify

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Taskify Team Kanban Platform

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/taskify.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" button
   - Select "Blueprint"

2. **Connect GitHub Repository**
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select your `taskify` repository

3. **Render will automatically detect `render.yaml`**
   - Review the services that will be created:
     - `taskify-db` - PostgreSQL database
     - `taskify-backend` - Node.js API
     - `taskify-frontend` - Static site
   - Click "Apply"

4. **Configure Environment Variables**

   For `taskify-backend`:
   - `CORS_ORIGIN` - Set to your frontend URL (will be: `https://taskify-frontend.onrender.com`)
   - `DATABASE_URL` - Automatically set from database
   - `NODE_ENV` - Already set to `production`
   - `PORT` - Already set to `3000`

   For `taskify-frontend`:
   - `VITE_API_BASE_URL` - Set to your backend URL (will be: `https://taskify-backend.onrender.com/api/v1`)

5. **Deploy**
   - Render will start building all services
   - Database will be created first
   - Backend will build and deploy (takes ~5 minutes)
   - Frontend will build and deploy (takes ~3 minutes)

## Step 3: Seed the Database (First Time Only)

After the backend is deployed, you need to seed the database with sample data:

1. Go to your backend service in Render Dashboard
2. Click "Shell" tab
3. Run the seed command:
   ```bash
   cd backend && npm run db:seed
   ```

This will create:
- 5 users (1 PM, 4 engineers)
- 3 projects
- 24 sample tasks
- 15 comments

## Step 4: Access Your Application

Your application will be available at:
- **Frontend**: `https://taskify-frontend.onrender.com`
- **Backend API**: `https://taskify-backend.onrender.com`
- **Health Check**: `https://taskify-backend.onrender.com/health`

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- 750 hours/month of free usage per service
- Database limited to 1GB storage

### Custom Domains
To use a custom domain:
1. Go to your frontend service settings
2. Click "Custom Domain"
3. Add your domain and follow DNS instructions

### Automatic Deployments
Render automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update feature"
git push
```

### Environment Variables Updates
If you need to update environment variables:
1. Go to service in Render Dashboard
2. Click "Environment" tab
3. Update variables
4. Service will automatically redeploy

### Database Backups
Render free tier does not include automatic backups. For production:
- Upgrade to paid plan ($7/month) for daily backups
- Or manually backup using `pg_dump`

### Monitoring
- View logs in Render Dashboard under "Logs" tab
- Set up health check alerts in service settings
- Monitor service metrics in dashboard

## Troubleshooting

### Backend fails to start
- Check DATABASE_URL is set correctly
- Verify migrations ran successfully in build logs
- Check for TypeScript compilation errors

### Frontend can't connect to backend
- Verify VITE_API_BASE_URL is set correctly
- Check CORS_ORIGIN in backend matches frontend URL
- Ensure backend service is running

### Database connection issues
- Verify database service is running
- Check DATABASE_URL format
- Review database logs for connection errors

### Build failures
- Check Node.js version (requires >=20.0.0)
- Verify all dependencies in package.json
- Review build logs for specific errors

## Support

For Render-specific issues:
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Support: support@render.com

For Taskify application issues:
- See DEPLOYMENT.md for general deployment guide
- Review API documentation in specs/001-team-kanban-platform/contracts/
