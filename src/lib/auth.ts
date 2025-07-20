import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { Resend } from "resend";
import * as authSchema from "@/../auth-schema";
import ForgetPasswordMailTemplate from "@/components/custom/templates/forget-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ token, url, user }, request) {
      await resend.emails.send({
        from: "Quizify <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset Password",
        react: ForgetPasswordMailTemplate({ url: url }),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
      user: authSchema.users,
    },
  }),
});
