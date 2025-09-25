import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

export const resendClient = new Resend(process.env.RESEND_API);

export const sender = {
  email: process.env.EMAIL_FROM,
  name: "Prudvi chit-chat"
}