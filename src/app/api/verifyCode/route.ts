import { validateCode } from "@/validationSchema/verifyuser.valid";
import { date, z } from "zod";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// User Verification Route
export async function POST(req:Request) {
  const { username, code } = await req.json();

  console.log(username,code);
  

  const codeObj = {
    code: code,
  };
  const codeValidation = await validateCode.safeParse(codeObj);

  if (!codeValidation.success) {
    return Response.json(
      {
        success: codeValidation.success,
        message: codeValidation.error.issues[0].message,
      },
      { status: 500 }
    );
  }

  const getUser = await prisma.usertable.findFirst({
    where: {
      username: username,
    },
  });

  if (!getUser) {
    return Response.json({ success: false, message: "Invalid User" },{status:404});
  }

  const iscodeNotExpired = new Date(getUser.verifyCodeExpiry) > new Date();

  const checkCode = getUser.verifyCode == code;

  console.log(checkCode);

  if (iscodeNotExpired && checkCode) {
    await prisma.usertable.update({
      where: {
        username: username,
      },
      data: {
        isVerify: true,
      },
    });

    return Response.json(
      { success: true, mesage: "user verified successfully.." },
      { status: 200 }
    );
  }

  return Response.json({ success: false, mesage: "Invalid Code or Expired code" },{status:400});
}
