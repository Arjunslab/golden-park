import { Resend } from "resend";
import { getWelcomeTemplate, getOtpTemplate } from "../emails/templates.js";
import { Dotenv } from "dotenv";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendWelcomeEmail(name, email, sn) {
  try {
    const html = getWelcomeTemplate(sn);

    const finalHtml = html.replace(/{{name}}/g, name);

    await resend.emails.send({
      from: "Golden Park <welcome@golden.bajpai.dev>",
      to: email,
      subject: "Welcome to Golden Park 🎉",
      html: finalHtml,
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
    throw err;
  }
}

export async function sendOtpConsentEmail(name, email, otp, verificationLink) {
  try {
    const html = getOtpTemplate(name, otp, verificationLink);

    const finalHtml = html
      .replace(/{{name}}/g, name)
      .replace(/{{OTP}}/g, otp)
      .replace(/{{verificationLink}}/g, verificationLink || "");

    await resend.emails.send({
      from: "Golden Park <no-reply@golden.bajpai.dev>",
      to: email,
      subject: "Golden Park OTP Verification",
      html: finalHtml,
    });

    console.log(`✅ OTP email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    throw err;
  }
}

