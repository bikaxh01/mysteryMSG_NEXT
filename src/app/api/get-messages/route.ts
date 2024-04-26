import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(res: Response) {
  const session = await getServerSession(authOptions);
  const user = await session?.user;
  //@ts-ignore
  const id = parseInt(user?.id)
   console.log(user);
   

  if (!user) {
    return Response.json(
      { success: false, message: "Invalid user" },
      { status: 400 }
    );
  }

  try {

    // geting messages
    const isExists = await prisma.message.findMany({
        where:{
          userId:id
        }
      });
    
      
      
    if(isExists.length == 0){
        return Response.json(
            { success: false, message: "No Message", data:null },
            { status: 200 }
          );
    }

      return Response.json(
        { success: true, message: "success", data:isExists},
        { status: 200 }
      );
      
      
  } catch (error:any) {
    console.log(error.message);
    
    return Response.json(
      { success: false, message: "Error while getting messsages" },
      { status: 400 }
    );
  }
}


