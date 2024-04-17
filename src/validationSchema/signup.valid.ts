import { string, z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, { message: "username should atleast 5 character" })
  .max(12, { message: "username should less than 12 character" });

export const signUpValidation = z.object({
  username: usernameValidation,
  email: string().email({ message: "Invalid Email Format" }),
  password: string().min(8, { message: "Password should atleast 8 character" }),
});
