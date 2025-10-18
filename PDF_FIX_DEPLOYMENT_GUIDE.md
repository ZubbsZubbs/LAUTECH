# 📄 PDF Viewing Fix - Deployment Guide

## 🔍 Current Situation

**Problem:** PDFs work locally but return `Cannot GET /uploads/applications/filename.pdf` on live site

**Root Cause:** The fixes are only on your local machine - NOT deployed to production yet!

---

## 🚀 Step 1: Deploy the Changes

### Option A: Using Git (Recommended)

```bash
# 1. Commit the changes
cd C:\Users\Admin\Desktop\LAUTECH\backend
git add .
git commit -m "Fix PDF serving and email timeout issues"

# 2. Push to your repository
git push origin master
```

### Option B: Manual Deployment
If your hosting platform (Render) auto-deploys from Git, it will automatically pick up the changes after you push.

---

## 🔧 Step 2: Verify Deployment

Once deployed, visit these URLs on your **live site**:

### 1. Check if backend is updated:
```
https://localhost:9000/health
```
Should return: `{"status":"OK","timestamp":"..."}`

### 2. Check uploads directory diagnostic:
```
https://localhost:9000/test-uploads
```

This will show you:
- Where the server is looking for files
- Which paths exist
- List of files in the uploads directory

### 3. Check specific file:
```
https://localhost:9000/test-uploads?file=birthCertificate-1760282176496-60228965.pdf&path=applications
```

---

## 🐛 Step 3: Diagnose the Issue

Based on the `/test-uploads` response, you'll see one of these scenarios:

### Scenario A: Files Don't Exist ❌
```json
{
  "fileChecks": {
    "path1": { "exists": false },
    "path2": { "exists": false },
    ...
  }
}
```

**Solution:** The uploads folder is not being deployed. You need to:

1. **Check `.gitignore`** - Make sure `uploads/` is NOT ignored
2. **Add uploads to Git:**
   ```bash
   git add uploads/
   git commit -m "Add uploads directory"
   git push
   ```

### Scenario B: Wrong Path ❌
```json
{
  "uploadsPath": "/app/dist/uploads",  // Looking here
  "fileChecks": {
    "path1": { "path": "/app/dist/uploads/...", "exists": false },
    "path2": { "path": "/app/uploads/...", "exists": true }  // But files are here!
  }
}
```

**Solution:** The path detection is finding the wrong location. The code should auto-detect, but if not, you may need to set an environment variable.

### Scenario C: Files Exist but Not Served ❌
```json
{
  "fileChecks": {
    "path1": { "exists": true, "isFile": true }  // File exists!
  }
}
```

But still getting 404 when accessing directly.

**Solution:** Static file serving middleware issue. Check CORS or file permissions.

---

## 📋 Step 4: Common Issues & Solutions

### Issue 1: `.gitignore` is blocking uploads

**Check:**
```bash
cat .gitignore | grep uploads
```

**Fix:** Remove or comment out the uploads line:
```bash
# uploads/  ← Comment this out or remove it
```

### Issue 2: Uploads folder is empty on server

**Fix:** Make sure files are committed:
```bash
git add uploads/applications/*.pdf
git add uploads/applications/*.png
git commit -m "Add uploaded files"
git push
```

### Issue 3: Render is not persisting uploads

**Problem:** Render's free tier doesn't persist files between deploys!

**Solution:** Use a cloud storage service:
- AWS S3
- Cloudinary
- Google Cloud Storage
- Or upgrade to Render's persistent disk

---

## 🎯 Quick Fix for Testing

If you just want to test if the path detection works, try accessing:

```
https://localhost:9000/uploads/applications/birthCertificate-1760282176496-60228965.pdf
```

**Expected Result:**
- ✅ PDF downloads/displays
- ❌ 404 error = files not on server

---

## 📝 Deployment Checklist

- [ ] Changes committed to Git
- [ ] Changes pushed to repository  
- [ ] Render/hosting platform redeployed
- [ ] `/health` endpoint returns OK
- [ ] `/test-uploads` shows correct paths
- [ ] Uploads directory exists on server
- [ ] Files exist in uploads directory
- [ ] Direct PDF URL works
- [ ] PDF viewing works in admin panel

---

## 🆘 If Still Not Working

1. **Check Render logs:**
   - Look for the upload path detection logs
   - Should see: `✅ Found uploads directory at: [path]`

2. **Check if uploads persist:**
   - Upload a new file via the application form
   - Check if it appears in `/test-uploads`
   - Try to access it directly

3. **Consider using cloud storage:**
   - Render free tier doesn't persist files
   - Files uploaded will disappear on next deploy
   - Use S3/Cloudinary for production

---

## 💡 The Real Issue

**Most likely cause:** Your hosting platform (Render free tier) **does not persist the uploads folder** between deploys!

Every time you deploy:
1. New container is created
2. Code is deployed
3. **Uploads folder is empty** (not part of the code)
4. Old files are gone

**Solution:** 
- Use Render's persistent disk (paid feature)
- OR migrate to cloud storage (S3, Cloudinary)
- OR use a different hosting platform that persists files

---

## 🚀 Next Steps

1. Deploy the changes (git push)
2. Visit `/test-uploads` on your live site
3. Share the response with me
4. We'll diagnose from there!

---

**Note:** The email fixes are already working because emails don't need file persistence - they're sent immediately. PDFs need the actual files to exist on the server!

