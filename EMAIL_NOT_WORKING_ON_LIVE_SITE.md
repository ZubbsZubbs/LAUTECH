# 🚨 Email Not Working on Live Site - Troubleshooting Guide

## 📋 Current Situation
- ✅ Emails work locally
- ❌ Emails NOT working on live site (Render)
- ✅ Email credentials are set in Render
- ✅ Code has been deployed

---

## 🔍 Step 1: Verify Email Configuration on Render

### Visit this URL on your live site:
```
https://lautech-edu-ng.onrender.com/test-email
```

### Expected Responses:

#### ✅ **Success Response:**
```json
{
  "emailConfigured": true,
  "emailUser": "✅ SET",
  "emailPass": "✅ SET (hidden)",
  "emailFrom": "LAUTECH Teaching Hospital <toadevs@gmail.com>",
  "testResult": {
    "status": "SUCCESS",
    "messageId": "<some-id@gmail.com>",
    "response": "250 OK"
  }
}
```
**Action:** Check your inbox! Email should arrive.

#### ❌ **Credentials Not Set:**
```json
{
  "emailConfigured": false,
  "emailUser": "❌ NOT SET",
  "emailPass": "❌ NOT SET",
  "testResult": {
    "status": "SKIPPED",
    "reason": "Email credentials not configured"
  }
}
```
**Action:** Go to Step 2 - Fix Environment Variables

#### ❌ **Email Failed:**
```json
{
  "emailConfigured": true,
  "emailUser": "✅ SET",
  "emailPass": "✅ SET (hidden)",
  "testResult": {
    "status": "FAILED",
    "error": "Invalid login: 535-5.7.8 Username and Password not accepted"
  }
}
```
**Action:** Go to Step 3 - Fix Gmail Credentials

---

## 🔧 Step 2: Fix Environment Variables on Render

### Go to Render Dashboard:
1. Navigate to: https://dashboard.render.com
2. Click on your backend service
3. Go to **"Environment"** tab
4. Check if these variables exist:

### Required Variables:
```
EMAIL_USER=toadevs@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=LAUTECH Teaching Hospital <toadevs@gmail.com>
```

### ⚠️ Common Mistakes:

#### Mistake 1: Using Regular Password
```
❌ EMAIL_PASS=myGmailPassword123
✅ EMAIL_PASS=abcd efgh ijkl mnop  (16-character App Password)
```

#### Mistake 2: Extra Spaces
```
❌ EMAIL_USER= toadevs@gmail.com  (space before email)
✅ EMAIL_USER=toadevs@gmail.com
```

#### Mistake 3: Wrong Variable Names
```
❌ GMAIL_USER=toadevs@gmail.com
❌ EMAIL_USERNAME=toadevs@gmail.com
✅ EMAIL_USER=toadevs@gmail.com
```

### After Setting Variables:
1. Click **"Save Changes"**
2. Render will automatically redeploy (2-5 minutes)
3. Wait for deployment to complete
4. Test again: `https://lautech-edu-ng.onrender.com/test-email`

---

## 🔑 Step 3: Get Gmail App Password

### If you're using regular Gmail password, it won't work!

### Generate App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. You might need to enable 2FA first: https://myaccount.google.com/security
3. Click **"Generate"** or **"Create"**
4. Select **"Mail"** and **"Other (Custom name)"**
5. Name it: "LAUTECH Backend"
6. Click **"Generate"**
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
8. Paste it in Render as `EMAIL_PASS` (remove spaces: `abcdefghijklmnop`)

### Alternative: Enable Less Secure Apps
⚠️ **Not recommended** but works:
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn on "Allow less secure apps"
3. Use your regular Gmail password

---

## 🐛 Step 4: Check Render Logs

### View Logs:
1. Go to Render Dashboard
2. Click on your backend service
3. Click **"Logs"** tab
4. Look for email-related messages

### What to Look For:

#### ✅ Good Signs:
```
📧 Email Configuration Check:
EMAIL_USER exists: true
EMAIL_PASS exists: true
✅ Email credentials found, creating transporter...
🔄 Trying Gmail SMTP 587 for email to toadevs@gmail.com...
✅ Email sent successfully using Gmail SMTP 587
```

#### ❌ Bad Signs:
```
❌ No email credentials found
❌ Invalid login: 535-5.7.8 Username and Password not accepted
❌ connect ETIMEDOUT
❌ Error: getaddrinfo ENOTFOUND smtp.gmail.com
```

---

## 🔍 Step 5: Test Contact Form Directly

### Use Postman or curl:
```bash
curl -X POST https://lautech-edu-ng.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "subject": "Test Subject"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "Contact message sent successfully",
  "data": { ... }
}
```

### Check Render Logs Immediately:
Look for:
```
✅ Contact form notification sent successfully
```
Or:
```
❌ Email sending failed: [error message]
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid login" Error
**Cause:** Wrong password or not using App Password

**Solution:**
1. Generate Gmail App Password (Step 3)
2. Update `EMAIL_PASS` in Render
3. Redeploy

### Issue 2: "connect ETIMEDOUT"
**Cause:** Render can't reach Gmail SMTP servers

**Solution:**
1. This is usually temporary
2. Wait a few minutes and try again
3. Check if Gmail is having issues: https://www.google.com/appsstatus

### Issue 3: "No email credentials found"
**Cause:** Environment variables not set or not loaded

**Solution:**
1. Verify variables in Render dashboard
2. Make sure you clicked "Save Changes"
3. Wait for redeploy to complete
4. Restart the service manually if needed

### Issue 4: Emails sent but not received
**Cause:** Gmail spam filter or rate limiting

**Solution:**
1. Check spam folder
2. Check Gmail's sent folder for the sending account
3. Wait 5-10 minutes (Gmail can delay emails)
4. Try sending to a different email address

---

## 📊 Debugging Checklist

- [ ] Environment variables set in Render
- [ ] Using Gmail App Password (not regular password)
- [ ] Deployment completed successfully
- [ ] `/test-email` endpoint returns success
- [ ] Render logs show "Email sent successfully"
- [ ] Checked spam folder
- [ ] Waited 5-10 minutes for email to arrive
- [ ] Tried different recipient email

---

## 🎯 Quick Test Script

### Test Locally First:
```bash
cd C:\Users\Admin\Desktop\LAUTECH\backend
node test-improved-email.js
```

**If this works but live site doesn't:**
→ Problem is with Render environment variables

**If this doesn't work:**
→ Problem is with Gmail credentials

---

## 🔄 Step 6: Force Redeploy

Sometimes Render needs a manual redeploy:

1. Go to Render Dashboard
2. Click your backend service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment (2-5 minutes)
5. Test again

---

## 📝 Environment Variables Template

Copy this to Render (replace with your actual values):

```
# Email Configuration
EMAIL_USER=toadevs@gmail.com
EMAIL_PASS=your_16_char_app_password_here
EMAIL_FROM=LAUTECH Teaching Hospital <toadevs@gmail.com>

# Database
DATABASE_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_here

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Firebase (if using)
DOMAIN_FIREBASE_API_KEY=your_firebase_key
DOMAIN_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
DOMAIN_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🆘 If Nothing Works

### Last Resort Options:

#### Option 1: Use Alternative Email Service
Switch to SendGrid, Mailgun, or AWS SES:
- More reliable for production
- Better deliverability
- Easier setup

#### Option 2: Check Gmail Account Status
- Make sure account isn't locked
- Check if 2FA is properly configured
- Verify account isn't flagged for suspicious activity

#### Option 3: Contact Me with Logs
Share:
1. Response from `/test-email`
2. Last 50 lines from Render logs
3. Screenshot of Render environment variables (hide password)

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ `/test-email` returns `"status": "SUCCESS"`
2. ✅ Email arrives in inbox within 1 minute
3. ✅ Render logs show `✅ Email sent successfully`
4. ✅ Contact form submissions send emails
5. ✅ Application submissions send emails

---

## 🚀 Next Steps

1. **Visit:** `https://lautech-edu-ng.onrender.com/test-email`
2. **Share the response** with me
3. **Check Render logs** for errors
4. **I'll help you fix it!** 🛠️

The diagnostic endpoint will tell us exactly what's wrong!

