import nodemailer from "nodemailer";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: `chit-chat PRUDVI`,
    to: email,
    subject: 'Welcome to Chit-Chat!',
    html: createWelcomeEmailTemplate(name, clientURL)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome Email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

/* export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
}; */