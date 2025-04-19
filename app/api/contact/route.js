import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { name, email, message } = body;

  // Validate required fields
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "All fields are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Outlook)
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender's name and email
      to: process.env.EMAIL_USER, // Your email to receive notifications
      subject: "New Contact Form Submission",
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: "Message sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send message." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}