import emailService from "./email.service";

export async function contactMessage(
  user_email: string,
  full_name: string,
  body: string,
  to: any,
) {
  const subject = 'Message from Contact Form';
    const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Message from Contact Form</title>
                </head>
                <body>
                    <p>${body}</p>
                    <p>Email: ${user_email}</p>
                    <p>Email: ${full_name}</p>
                </body>
                </html>
        `;
    return emailService.sendEmail(to, subject, html);
}