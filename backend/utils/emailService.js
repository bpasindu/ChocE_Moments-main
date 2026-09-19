import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your ChocE_Moments OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a4a4a; text-align: center;">ChocE Moments</h2>
          <hr style="border: 0; height: 1px; background: #e0e0e0; margin: 20px 0;">
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Use the following One-Time Password (OTP) to complete your login/signup:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888;">This code will expire in 5 minutes.</p>
          <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
          <hr style="border: 0; height: 1px; background: #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} ChocE Moments. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}
