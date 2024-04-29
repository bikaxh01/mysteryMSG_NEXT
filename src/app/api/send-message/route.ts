import { PrismaClient } from "@prisma/client";
import { error } from "console";


const prisma = new PrismaClient()

export async function POST(req:Request) {
 
    const {username,content} = await req.json()

    try {
        // checking user exists or not
      const User = await prisma.usertable.findFirst({
        where:{
            username:username
        }
      })      

      if(!User){
        return Response.json({
            success:false,
            message:"Invalid user"
        },{status:404})
      }
   
      // checking message accepting status 
      if(!User.isAcceptingMsg){
        return Response.json({
            success:false,
            message:"user is not accepting messages"
        },{status:404})
      }

      const newMessage = await prisma.message.create({
        data: {
          content: content,
          userId: User.id, 
        },
      });

  
        
      if(!newMessage){
        return Response.json({
          success:false,
          message:"Error while sending  messages"
      },{status:400}) 
      }

      
      return Response.json({
        success:true,
        message:"Message sent"
    },{status:200})

    } catch (error) {
        return Response.json({
            success:false,
            message:"Error while sending  messages"
        },{status:400}) 
    }
    
}