# Deployment Guide for Student Dashboard on Render

## Prerequisites
1. GitHub repository with your project
2. Cloudinary account
3. Render account

## Steps for Deployment

### 1. Environment Variables
Set the following environment variables on Render:
- `DATABASE_URL`: PostgreSQL database URL
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `SECRET_KEY`: A random secret key for Flask

### 2. Web Service Configuration
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`

### 3. Database
- Create a PostgreSQL database on Render
- Use the provided DATABASE_URL in your environment variables

### 4. Deployment Considerations
- Ensure your GitHub repository has all files: 
  - `app.py`
  - `requirements.txt`
  - `templates/index.html`
  - `static/script.js`

## Troubleshooting
- Check Render logs for any deployment or runtime errors
- Verify all environment variables are correctly set
- Ensure dependencies in `requirements.txt` are up to date
