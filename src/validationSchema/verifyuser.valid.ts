import { string, z } from "zod";

export const validateCode = z.object({
    code: string().length(6,{message:"code must be 6 character"})
})