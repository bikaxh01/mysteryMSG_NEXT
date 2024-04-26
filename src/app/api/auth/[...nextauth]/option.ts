import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: {
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

          const user = await prisma.usertable.findFirst({
            where: {
              email: email,
            },
          });

          if (!user) {
           return{error:"Invalid User"}
          }

          if (!user.isVerify) {
           
            return {error:"user is not verifyed"}
             
          }

          const checkPW = await compare(password, user.password);

          if (checkPW) {
            return user;
          } else {
            
            return {error:"wrong password"}
          
          }
        } catch (error: any) {
          return new Error(error);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({user})  {
      if(user?.error == "user is not verifyed"){
        throw new Error('user is not verifyed')
      }
      if(user?.error == "Invalid User"){
        throw new Error("Invalid User")
      }
      if(user?.error == "wrong password"){
        throw new Error("wrong password")
      }
      return true
    },
    async jwt({ user, token }) {

      if (user) {
        token.id = user.id?.toString();
        token.username = user.username;
        token.isVerify = user.isVerify;
        token.isAcceptingMsg = user.isAcceptingMsg;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username=token.username
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMsg = token.isAcceptingMsg;
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
};
