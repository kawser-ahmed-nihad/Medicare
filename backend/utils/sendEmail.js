import nodemailer from "nodemailer";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// Nodemailer 
const composer = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await composer.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: info.message.toString("base64url") },
    });
  } catch (err) {
    console.error("GMAIL ERROR:", err.response?.data || err.message);
    throw err;
  }
}

export function verificationEmailTemplate(name, verifyUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2563eb;">Verify your email</h2>
      <p>Hi ${name},</p>
      <p>Thanks for signing up. Please confirm your email address to activate your account.</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Verify Email
        </a>
      </p>
      <p>This link expires in ${process.env.EMAIL_VERIFY_EXPIRES_MIN || 30} minutes. If you didn't create this account, you can safely ignore this email.</p>
    </div>
  `;
}

export function resetPasswordEmailTemplate(name, resetUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2563eb;">Reset your password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click below to choose a new one.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>
      </p>
      <p>This link expires in ${process.env.PASSWORD_RESET_EXPIRES_MIN || 15} minutes. If you didn't request this, you can safely ignore this email — your password will not change.</p>
    </div>
  `;
}

export function doctorInviteEmailTemplate(name, setPasswordUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2563eb;">You've been added as a doctor on MediCare</h2>
      <p>Hi ${name},</p>
      <p>An admin has created your doctor profile. Set your password to activate your account and start managing your appointments.</p>
      <p style="margin: 24px 0;">
        <a href="${setPasswordUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Set Your Password
        </a>
      </p>
      <p>This link expires in ${process.env.INVITE_EXPIRES_HOURS || 72} hours. If you weren't expecting this, please contact the clinic.</p>
    </div>
  `;
}


export function appointmentConfirmationEmailTemplate({ patientName, doctorName, date, time, fee, paymentMethod, location }) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2563eb;">Your appointment is confirmed</h2>
      <p>Hi ${patientName},</p>
      <p>Your appointment with <strong>${doctorName}</strong> has been confirmed. Here are the details:</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; color:#64748b;">Date</td><td style="padding:6px 0; font-weight:600;">${date}</td></tr>
        <tr><td style="padding:6px 0; color:#64748b;">Time</td><td style="padding:6px 0; font-weight:600;">${time}</td></tr>
        <tr><td style="padding:6px 0; color:#64748b;">Fee</td><td style="padding:6px 0; font-weight:600;">৳${fee} (${paymentMethod === "online" ? "Paid online" : "Pay at hospital"})</td></tr>
        ${location ? `<tr><td style="padding:6px 0; color:#64748b;">Location</td><td style="padding:6px 0; font-weight:600;">${location}</td></tr>` : ""}
      </table>
      <p>Please arrive 10 minutes before your scheduled time. If you need to cancel or reschedule, please do so from your account.</p>
    </div>
  `;
}