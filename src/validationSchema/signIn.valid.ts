import { string, z } from "zod";

export const signInValidation = z.object({
    email: string().email({message:"Invalid Email Format"}),
    password: string().min(8,{message:"Password should atleast 8 character"})
})