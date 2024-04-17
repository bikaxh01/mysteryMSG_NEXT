import { boolean, string, z } from "zod";

export const acceptMsgvalidate = z.object({
    isAcceptingMsg: boolean()
})