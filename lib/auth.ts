import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { resend } from "./resend";
import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: 'LMS <onboarding@resend.dev>',
          to: [email],
          subject: 'LMS - Verify Your Email',
          html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });
      }
    }),
    admin()
  ]
});