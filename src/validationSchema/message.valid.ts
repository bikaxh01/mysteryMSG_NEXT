import { string, z } from "zod";

export const messageValidation = z.object({
    content : string()
})