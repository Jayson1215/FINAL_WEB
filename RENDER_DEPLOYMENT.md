# Render Deployment Guide

## Steps to Deploy to Render

### 1. Create a Render Account
- Go to https://render.com
- Sign up with GitHub

### 2. Connect GitHub Repository
- In Render dashboard → Click "New +"
- Select "Web Service"
- Connect your GitHub account and select `FINAL_WEB` repository

### 3. Configure Web Service
- **Name**: `finalweb-backend`
- **Root Directory**: `backend`
- **Runtime**: `Docker`
- **Region**: `Oregon` (or your preference)
- **Branch**: `main`
- **Auto-deploy**: Yes

### 4. Set Environment Variables
In Render dashboard, add these variables under "Environment":

```
APP_NAME=PhotoStudio Booking
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:cj+UYoeSCAiWitHIvdu+OfaiwLB6j4zj65LSWDCLH/Q=
APP_URL=https://<your-render-url>

DB_CONNECTION=mysql
DB_HOST=mysql-534e5ce-urios-74af.g.aivencloud.com
DB_PORT=20478
DB_DATABASE=defaultdb
DB_USERNAME=avnadmin
DB_PASSWORD=<your-aiven-password>
MYSQL_ATTR_SSL_CA=/app/ca.pem

FRONTEND_URL=https://finalweb-pied.vercel.app
FRONTEND_URLS=https://finalweb-pied.vercel.app,http://localhost:5173,http://localhost:5174

GOOGLE_CLIENT_ID=1013098177252-cotfhmi61po05fj9r7a5v500t8d7uu1j.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_REDIRECT_URI=https://<your-render-url>/api/auth/google/callback
```

### 5. Add MySQL CA Certificate
- Upload `ca.pem` file to Render (this should be in `backend/ca.pem`)
- Or add it to Git (it's already there)

### 6. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Monitor the logs to ensure everything starts correctly

### 7. Update Frontend
In `frontend/.env.production`:
```
VITE_API_URL=https://<your-render-url>/api
```

Then deploy frontend to Vercel.

### 8. Monitor Deployment
- Check Render logs for any errors
- Visit `/api/health` to verify the app is running
- Test the API endpoints from your frontend

### 9. Photo Deployment Checklist (Cross-Device)
- Keep deployable images in `backend/public/assets/images`.
- Keep frontend static images in `frontend/public/images`.
- Commit and push image files to Git before deploying.
- Use API-served image paths or URLs stored in DB values (for example: `/assets/images/your-photo.png` or `https://...`).
- After deployment, verify a sample image URL works:
	- `https://<your-backend-url>/api/images/service_wedding.png`

The Docker build now syncs images from `frontend/public/images` into `backend/public/assets/images` so both frontend and backend image paths stay available in production.

## Troubleshooting

### Logs Not Showing
- Go to Render dashboard → Your service → Logs
- Scroll down to see real-time logs

### Database Connection Issues
- Verify MySQL credentials in Aiven
- Check SSL certificate path
- Ensure Aiven firewall allows Render IPs

### Build Failures
- Check Docker image size (Render has limits)
- Ensure `Dockerfile` in `backend/` directory
- Verify all dependencies in `composer.json`

## Notes
- Render provides 1 free tier instance (limited)
- Consider upgrading for production
- Database is separate (Aiven)
- Frontend is on Vercel
- Backend on Render
