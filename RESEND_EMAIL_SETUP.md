# Resend Email Setup Guide

## Problem
Render.com has restricted outbound SMTP connections on their free tier as of September 2025. This causes Gmail SMTP timeouts when trying to send emails from your deployed application.

## Solution
We've implemented Resend as the primary email service, which works perfectly with Render's free tier. Resend provides a modern email API that doesn't require SMTP connections.

## Setup Instructions

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. After logging in, go to the API Keys section
2. Click "Create API Key"
3. Give it a name like "LAUTECH Hospital"
4. Copy the API key (starts with `re_`)

### 3. Add Environment Variables to Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:

```
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=LAUTECH Teaching Hospital <noreply@lautech.edu.ng>
```

### 4. Verify Domain (Optional but Recommended)
1. In Resend dashboard, go to "Domains"
2. Add your domain: `lautech.edu.ng`
3. Follow the DNS verification steps
4. This allows you to send emails from `noreply@lautech.edu.ng`

**Note:** Until you verify your domain, you can use the default Resend domain for testing: `onboarding@resend.dev`

### 5. Deploy the Changes
1. Push this branch to your repository:
   ```bash
   git add .
   git commit -m "feat: Add Resend email integration for Render compatibility"
   git push origin resend-email-integration
   ```
2. Merge to master or deploy directly from this branch
3. Render will automatically detect the changes and redeploy

### 6. Test the Setup
1. After deployment, try sending a contact form
2. Check the logs to see "Email sent successfully via Resend"
3. Or run the test script locally:
   ```bash
   cd backend
   node test-resend-email.js
   ```

## Fallback Behavior
- If Resend is not configured, the system will fall back to Gmail SMTP
- If both fail, emails are logged to the file system
- The contact form will still work and save data to the database

## Benefits of Resend
- ✅ Works with Render free tier
- ✅ No SMTP connection issues
- ✅ Better deliverability
- ✅ Detailed analytics
- ✅ 3,000 free emails per month
- ✅ Modern API with better error handling
- ✅ Real-time webhook notifications
- ✅ Email tracking and analytics

## Cost
- **Free tier**: 3,000 emails per month
- **Paid plans**: Start at $20/month for 50,000 emails

## Troubleshooting

### Issue: Still seeing SMTP timeout errors
1. Verify the `RESEND_API_KEY` environment variable is set correctly in Render
2. Check that the API key is valid in your Resend dashboard
3. Ensure the `EMAIL_FROM` format is correct: `Name <email@domain.com>`
4. Verify that the backend has been redeployed after adding the environment variables

### Issue: Email not being sent from verified domain
1. Ensure you've verified your domain in Resend dashboard
2. Check that DNS records are properly configured
3. Wait up to 48 hours for DNS propagation
4. Use `onboarding@resend.dev` in the meantime for testing

### Issue: "Invalid API key" error
1. Double-check that you copied the entire API key (starts with `re_`)
2. Make sure there are no extra spaces in the environment variable
3. Try creating a new API key in your Resend dashboard

## Migration Complete
The email service now automatically tries Resend first, then falls back to Gmail SMTP if needed. 

**What was changed:**
- ✅ Added `resend` package to dependencies
- ✅ Created `backend/email/resend-email.service.ts`
- ✅ Updated `backend/email/email.service.ts` to use Resend first
- ✅ Created test script `backend/test-resend-email.js`
- ✅ All changes are in the `resend-email-integration` branch

## Alternative Solution: Upgrade Render Plan
If you prefer to stick with Gmail SMTP, you can upgrade to a paid Render plan (starting at $7/month) which removes the SMTP restrictions. However, Resend is recommended for better deliverability and modern email handling.
