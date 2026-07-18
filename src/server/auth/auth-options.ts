import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { ROUTES } from "@/constants/routes";
import { verifyPassword } from "@/server/auth/password";
import { credentialsSchema } from "@/server/auth/validation";
import { prisma } from "@/server/database";
import { getServerEnv } from "@/server/env";

export const authOptions: NextAuthOptions = {
  pages: {
    error: ROUTES.login,
    signIn: ROUTES.login,
    signOut: ROUTES.home,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash || user.status !== "ACTIVE") {
          return null;
        }

        const passwordMatches = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        await prisma.user.update({
          data: { lastLoginAt: new Date() },
          where: { id: user.id },
        });

        return {
          email: user.email,
          id: user.id,
          image: user.image,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }

      return session;
    },
  },
  secret: getServerEnv().AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
