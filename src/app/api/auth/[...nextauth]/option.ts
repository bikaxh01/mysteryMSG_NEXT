import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { error } from "console";
import { Session } from "inspector";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "123",
      name: "Bikash",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const email = await credentials.identifier;
          const password = await credentials.password;

          const user = await prisma.user.findFirst({
            where: {
              email: email,
            },
          });

          if (!user) {
            throw new Error("Invalid User");
          }

          if (!user.isVerify) {
            throw new Error("User is not Verifyed");
          }

          const checkPW = await compare(password, user.password);

          if (!checkPW) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error: any) {
          return new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (token) {
        token.id = user.id;
        token.username = user.username;
        token.isVerify = user.isVerify
        token.email = user.email;
        token.isAcceptingMsg = user.isAcceptingMsg;
      }

      return token;
    },

    async session({ session, token }) {

      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMsg = token.isAcceptingMsg
        
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
