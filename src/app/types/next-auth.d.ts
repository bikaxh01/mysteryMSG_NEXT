import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      isVerify?:boolean
      isAcceptingMsg?: boolean;
    } & DefaultSession["user"];
  }
  
  interface User {
    id?: string;
    username?: string;
    email?: string;
    isVerify?: boolean;
    isAcceptingMsg?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?:string
    isVerify?: boolean;
    isAcceptingMsg?: boolean;
    username?: string;
  }
}