import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  Request: Request,
  { params }: { params: { messageID: string } }
) {
  const { messageID } = params;

  if (!messageID) {
    return Response.json({
      success: false,
      message: "Invalid Message ID",
    });
  }

  try {
    const getMessage = await prisma.message.delete({
      where: {
        id: parseInt(messageID),
      },
    });

    return Response.json({
      success:true,
      message:"Successfully Deleted"
    });
  } catch (error) {
    return Response.json({
      success:false,
      message:"Invalid message id"
    })
  }
}
