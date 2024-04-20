import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(res: Response) {
  const session = await getServerSession(authOptions);
  const user = await session?.user;

  if (!user) {
    return Response.json(
      { success: false, message: "Invalid user" },
      { status: 400 }
    );
  }

  try {
    //@ts-ignore
    const userID = 12;

    // geting messages
    const user = await prisma.user.findUnique({
        where: {
          id: userID, 
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

    if(!user){
        return Response.json(
            { success: false, message: "invalid user", data:null },
            { status: 200 }
          );
    }

      return Response.json(
        { success: true, message: "success", data:user?.messages },
        { status: 200 }
      );
      
      
  } catch (error) {
    return Response.json(
      { success: false, message: "Error while getting messsages" },
      { status: 400 }
    );
  }
}

// const messages = await userModel.aggregate([
//     {$match:{id:userID}},
//     {$unwind:"$messages"},
// {sort:{"message.createdAt":-1}},
// {group:{id:"_id",messages:{$push:"$messages"}}}
// ]);
