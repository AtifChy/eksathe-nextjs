import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendAuthEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail(user.email, "Reset your EKsathe password", url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail(user.email, "Verify your EKsathe account", url);
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});
