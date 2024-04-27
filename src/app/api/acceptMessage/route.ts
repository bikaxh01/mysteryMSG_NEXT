import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const user = await session?.user;
  

  if (!user) {
    return Response.json(
      { success: false, message: "Invalid user" },
      { status: 400 }
    );
  }

  //@ts-ignore
  const userID = parseInt (user.id)
  const { acceptMessage } = await req.json();

  try {
    //update isaccepting user message
    const updatedUser = await prisma.usertable.update({
      where: {
        id: userID,
      },
      data: {
        isAcceptingMsg: acceptMessage,
      },
    });
    
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Invalid user" },
        { status: 400 }
      );
    }

    return Response.json(
        { success: true, message: "User updated successfully..." },
        { status: 200 }
      );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error while updating user " },
      { status: 400 }
    );
  }
}



//geting user message status
export async function GET(req:Request) {

    const session = await getServerSession(authOptions)
   
    const user = await session?.user
    
    //@ts-ignore
    const userID = parseInt(user?.id)
    

    if(!user){
        return Response.json(
            { success: false, message: "Invalid user" },
            { status: 400 }
          );
    }
try {
    
        const userMessageStatus = await prisma.usertable.findUnique({
            where:{
                id:userID
            }
        })
        
    
        if(!userMessageStatus){
            return Response.json(
                { success: false, message:  "user not found" },
                { status: 404 }
              );
        }
        
     return Response.json(
        { success: true, isAccepting: userMessageStatus.isAcceptingMsg },
        { status: 200 }
      );
    
} catch (error) {
    return Response.json(
        { success: false, message:"Error while checking message status" },
        { status: 400 }
      );
}
    
}