import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return new Response(JSON.stringify({ message: "Email is required" }), {
      status: 400,
    });
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
      from: process.env.EMAIL_USER, // Sender email
      to: process.env.EMAIL_USER, // Your email to receive notifications
      subject: "New Subscription",
      text: `You have a new subscriber: ${email}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Subscription successful" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error sending email" }), {
      status: 500,
    });
  }
}
