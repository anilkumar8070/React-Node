# Vercel Deployment Guide

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. MongoDB Atlas account with a database URI
3. All necessary API keys for your services (Cloudinary, Groq SDK, etc.)
4. Vercel CLI installed (optional but recommended): `npm i -g vercel`

## Project Structure

This project is configured as a monorepo with:
- **Client**: React + Vite frontend in `/client`
- **Server**: Node.js/Express backend in `/server`
- **API**: Serverless functions in `/api`

## Deployment Steps

### 1. Prepare Your Environment Variables

You'll need to set these environment variables in Vercel:

#### Server Environment Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Your Vercel frontend URL (e.g., https://your-app.vercel.app)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `GROQ_API_KEY` - Groq SDK API key (for chatbot)
- `EMAIL_USER` - Email service user (for nodemailer)
- `EMAIL_PASS` - Email service password
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `5000` (optional)

### 2. Deploy Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd e:\React-Node
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: [Select your account]
# - Link to existing project: N
# - Project name: [Enter your project name]
# - Directory: ./
# - Override settings: N
```

### 3. Deploy Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install --prefix client && npm install --prefix server`

### 4. Configure Environment Variables in Vercel

1. Go to your project settings in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add all the environment variables listed above
4. Make sure to add them for **Production**, **Preview**, and **Development** environments

### 5. Configure Build Settings

In your Vercel project settings:

1. **Build & Development Settings**:
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install --prefix client && npm install --prefix server`

2. **Root Directory**: `.` (leave as root)

3. **Node.js Version**: 18.x or 20.x (recommended)

### 6. Deploy

Once configured, click **Deploy**. Vercel will:
1. Install dependencies
2. Build your React frontend
3. Deploy serverless functions for your backend
4. Provide you with a URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment Configuration

### Update CORS Origins

After deployment, you'll need to update your CORS configuration:

1. Get your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. This is already handled in the code, but ensure `CLIENT_URL` environment variable is set

### Update Client API Calls

The client is configured to make API calls to `/api/*` which will be automatically routed to your serverless functions.

### Database Setup

1. Ensure your MongoDB Atlas cluster is accessible from anywhere (0.0.0.0/0) or specifically from Vercel's IP ranges
2. The seed data will run automatically on first deployment

## Important Notes

### Socket.IO Limitations

⚠️ **Important**: Vercel's serverless functions have limitations with WebSocket connections. Your Socket.IO implementation may not work as expected. Consider:

1. **Alternative**: Use a separate server for Socket.IO (e.g., Railway, Render, or Heroku)
2. **Hybrid Approach**: Deploy the REST API on Vercel and Socket.IO server elsewhere
3. **Alternative Service**: Use services like Pusher or Ably for real-time features

### File Uploads

The current implementation uses local file storage in `/uploads`. For production:

1. ✅ You're already using Cloudinary - ensure all uploads go through Cloudinary
2. Remove local file storage dependencies
3. The `.vercelignore` file already excludes the uploads folder

### Serverless Function Limits

Vercel Free Tier Limits:
- Function execution: 10 seconds
- Function size: 50MB
- Deployments: 100/day

If you need longer execution times, consider upgrading or using a different platform for compute-heavy operations.

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Routes Not Working

- Check that `vercel.json` is properly configured
- Verify environment variables are set
- Check function logs in Vercel dashboard

### Database Connection Issues

- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### CORS Errors

- Add your Vercel URL to `CLIENT_URL` environment variable
- Check CORS configuration in `server/index.js`

## Continuous Deployment

Once set up, Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: When you push to other branches or open pull requests

## Alternative: Deploy to Different Platforms

If Vercel doesn't meet your needs (especially for Socket.IO), consider:

1. **Railway** - Great for full-stack apps with WebSockets
2. **Render** - Similar to Railway, good WebSocket support
3. **Heroku** - Traditional platform with good WebSocket support
4. **DigitalOcean App Platform** - Good balance of features
5. **AWS Elastic Beanstalk** - More complex but very powerful

## Monitoring

After deployment, monitor your application:
- Vercel Dashboard: View deployments, logs, and analytics
- MongoDB Atlas: Monitor database performance
- Set up error tracking (e.g., Sentry) for production issues

## Support

For issues with:
- Vercel deployment: [Vercel Documentation](https://vercel.com/docs)
- This project: Check your project repository issues

---

**Last Updated**: December 21, 2025
