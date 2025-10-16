# Email Configuration Setup

## Current Status
The email service is currently configured to log email content to the console instead of sending real emails because no email credentials are configured.

## To Enable Real Email Sending

1. Create a `.env` file in the backend directory
2. Add the following configuration:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password (not your regular Gmail password)

3. **Update the .env file** with your credentials

## Alternative Email Services

You can also use other email services by modifying the transporter configuration in `email/email.service.ts`:

### SendGrid
```javascript
transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Mailgun
```javascript
transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASSWORD
  }
});
```

## Current Behavior
- ✅ Appointments are created successfully
- ✅ Email content is logged to console
- ✅ No errors thrown when email fails
- ✅ Users can see appointment confirmation in UI

## Testing
After setting up email credentials, restart the server and test appointment creation. You should see:
- Console log: "✅ Email sent successfully: [message-id]"
- Real email delivered to the patient's inbox
