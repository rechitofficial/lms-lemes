import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || "")

export async function sendEmailVerificationOTP(email: string, otp: string) {
  await resend.emails.send({
    from: "LMS <no-reply@lms.com>",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  });
}