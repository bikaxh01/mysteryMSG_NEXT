import bcrypt from "bcryptjs";
import { signUpValidation } from "@/validationSchema/signup.valid";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { customAlphabet, nanoid } from "nanoid";
import { sendMail } from "@/utils/email";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    //OTP generation
    const nanoid = customAlphabet("1234567890", 6);
    const OTP = nanoid();

     //Encrypting password
     const hashPw = await bcrypt.hash(password, 10);
     const ExpiryDate = new Date();
     ExpiryDate.setHours(ExpiryDate.getHours() + 1);

    // validation
    const isExistByUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    
    if (isExistByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already Taken...",
        },
        { status: 400 }
      );
    }
   
    const isExistByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    console.log(`from BE ${isExistByEmail}`);
    
     
    if (isExistByEmail) {
      //TODO
      if(isExistByEmail.isVerify){
        return Response.json({
            success: false,
            message:"Email is already used"
        },{status:400})
      }else{
        await prisma.user.update({
            where:{
             email:email
            },
            data: {
              password: hashPw,
              verifyCode:OTP,
              verifyCodeExpiry:ExpiryDate
            },
          });
          
      }

    } else {

      await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashPw,
          verifyCodeExpiry: ExpiryDate,
          verifyCode: OTP,
        },
      });
    }
    // sending mail
    const emailResponse = await sendMail(email, OTP, username);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    
    return Response.json(
      {
        success: true,
        message: "user created check your email",
      },
      { status: 200 }
    );
  } catch (error:any) {
    console.log("ERROR:", error.message);

    return NextResponse.json("!OK");
  }
}
