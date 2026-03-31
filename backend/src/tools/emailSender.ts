import { createTransport } from "nodemailer";

// Notice the curly braces added around to, subject, and body
export const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<string> => {
  const transporter = createTransport({
    service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  try {
    console.log(to, body, subject, "mail object");
    await transporter.sendMail({
      from: `"AutonomiX Agent" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: body,
    });

    return `Email sent successfully to ${to}`;
  } catch (error) {
    const err = error as Error;
    return `Email sending failed: ${err.message}`;
  }
};
