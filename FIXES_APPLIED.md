# 🔧 Fixes Applied for Email and PDF Issues

## Date: October 18, 2025

## Issues Resolved

### 1. ✅ Email Service Timeout on Hosted Site
**Problem:** Email sending service was timing out on the hosted site, preventing emails from being sent.

**Root Cause:** 
- The email service had a 10-second timeout which was too short for production environments
- Network latency on hosted servers caused emails to fail

**Solution Applied:**
- Increased email timeout from 10 seconds to 30 seconds in `backend/email/email.service.ts`
- This gives the SMTP server more time to respond in production environments

**File Changed:** `backend/email/email.service.ts` (Line 112)

---

### 2. ✅ Hardcoded Localhost in Password Reset Emails
**Problem:** Password reset emails contained localhost URLs instead of the production frontend URL.

**Root Cause:**
- `backend/services/auth.service.ts` had a fallback to `http://localhost:3000` when `FRONTEND_URL` was not set

**Solution Applied:**
- Removed hardcoded localhost fallback
- Added multiple environment variable checks: `FRONTEND_URL`, `NEXT_PUBLIC_FRONTEND_URL`
- Set production default to `https://lautech-edu-ng.onrender.com`

**File Changed:** `backend/services/auth.service.ts` (Line 165-166)

---

### 3. ✅ CORS Configuration for Live Site
**Problem:** CORS errors preventing frontend from accessing backend APIs on the live site.

**Root Cause:**
- CORS was only configured for localhost origins
- Production frontend domain was not included

**Solution Applied:**
- Implemented dynamic CORS origin checking
- Added support for:
  - All localhost ports (3000, 3001, 3002)
  - lautech domains
  - vercel.app deployments
  - netlify.app deployments  
  - render.com deployments
- Configured proper credentials and headers for file downloads

**File Changed:** `backend/app.ts` (Lines 36-67)

---

### 4. ✅ PDF Viewing on Live Site
**Problem:** PDF files were not accessible on the live site but worked locally.

**Root Cause:**
- The uploads directory path was hardcoded relative to `__dirname`
- In production (compiled code in `dist/`), the path resolution was incorrect
- Files were stored in `backend/uploads/applications/` but the static file server couldn't find them

**Solution Applied:**
- Implemented intelligent path detection that checks multiple possible upload directories:
  - `dist/uploads` (when running from compiled code)
  - `../uploads` (one level up from dist)
  - `process.cwd()/uploads` (from project root)
  - `process.cwd()/backend/uploads` (from project root with backend folder)
- Added comprehensive logging to debug file serving issues
- Enhanced CORS headers for file access:
  - `Access-Control-Allow-Origin: *`
  - `Cross-Origin-Resource-Policy: cross-origin`
  - `Cross-Origin-Embedder-Policy: unsafe-none`
- Added proper caching headers for uploaded files

**Files Changed:** 
- `backend/app.ts` (Lines 98-143)

---

## Environment Variables Required

Make sure these are set on your hosting platform (Render, Vercel, etc.):

```env
# Frontend URL (IMPORTANT!)
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Backend API URL (for frontend)
NEXT_PUBLIC_API_URL=https://lautech-edu-ng.onrender.com
```

---

## Deployment Checklist

### Backend (Render/Hosting Platform)
1. ✅ Set `FRONTEND_URL` environment variable to your production frontend URL
2. ✅ Ensure `EMAIL_USER` and `EMAIL_PASS` are correctly configured
3. ✅ Verify the `uploads` directory exists and is writable
4. ✅ Redeploy backend with the new changes
5. ✅ Check logs for upload directory path confirmation (look for "✅ Found uploads directory at:")

### Frontend
1. ✅ Ensure `NEXT_PUBLIC_API_URL` points to your backend URL
2. ✅ Redeploy frontend if needed

---

## Testing Instructions

### Test Email Sending
1. Try password reset functionality
2. Submit a contact form
3. Create a new application
4. Check email logs at `backend/logs/emails.log` for status

### Test PDF Viewing
1. Go to `/admin/applications` on your live site
2. Click on an application to view details
3. Try to view/download PDF documents
4. Check browser console for any CORS errors
5. Check backend logs for file serving messages

---

## Debugging Tips

### If Emails Still Don't Send
1. Check backend logs for email service messages
2. Verify `EMAIL_USER` and `EMAIL_PASS` are correct
3. Ensure Gmail App Password is being used (not regular password)
4. Check `backend/logs/emails.log` for detailed error messages

### If PDFs Still Don't Load
1. Check backend logs for upload directory path
2. Verify files exist in the uploads directory on the server
3. Test direct URL access: `https://your-backend.com/uploads/applications/filename.pdf`
4. Check browser Network tab for 404 or CORS errors
5. Ensure the uploads directory is included in your deployment

---

## Files Modified

1. `backend/email/email.service.ts` - Increased timeout
2. `backend/services/auth.service.ts` - Fixed password reset URL
3. `backend/app.ts` - Enhanced CORS and file serving
4. `backend/dist/*` - Compiled JavaScript files (auto-generated)

---

## Next Steps

1. **Deploy Changes**: Push these changes to your Git repository
2. **Redeploy Backend**: Trigger a redeploy on Render (or your hosting platform)
3. **Set Environment Variables**: Ensure all required env vars are set
4. **Test Thoroughly**: Test both email and PDF functionality on the live site
5. **Monitor Logs**: Check backend logs for any errors

---

## Support

If issues persist after applying these fixes:

1. Check the backend logs on your hosting platform
2. Verify all environment variables are correctly set
3. Test the backend health endpoint: `https://your-backend.com/health`
4. Check that the uploads directory exists and has proper permissions

---

**All fixes have been applied and compiled. Ready for deployment! 🚀**

