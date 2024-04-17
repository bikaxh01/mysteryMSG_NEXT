import { NextRequest } from "next/server";
import {z} from 'zod'
import { PrismaClient } from "@prisma/client";
import { usernameValidation } from "@/validationSchema/signup.valid";

const prisma = new PrismaClient()

const validateusername  = z.object({
    username:usernameValidation
})

export async function GET(req:NextRequest){
    const {searchParams} = new URL(req.url)
    const Queryprams ={username:searchParams.get("username")} 
    const validation = await validateusername.safeParse(Queryprams)

    if(!validation.success){        
        return Response.json({success:validation.success,
            message:validation.error.issues[0].message
        },{status:500})
    }
    const {username} = validation.data
     console.log(username);
     
    const isTaken= await prisma.user.findFirst({
        where:{
            username:username,
            isVerify:true
        }
    })
    

    if(isTaken){
        return Response.json({success:false,message:"username Taken"},{status:400})
    }


    return Response.json({success:"true",message:"username is unique"})
}