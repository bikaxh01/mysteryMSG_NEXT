import { ApiResponse } from "@/app/types/ApiResponse";
import { Resend } from "resend";
import emailTemplate from "../../email/emailTemplate";
import { error} from "console";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email Sender
export async function sendMail(
  email: string,
  otp: string,
  username: string
): Promise<ApiResponse> {
  try {

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Mail",
      react: emailTemplate({ username, otp }),
    });
    
    if(data.error){
      throw error
    }
     
    return { success: true, message: "Mail Sent" };
  } catch (error: any) {
    return { success: false, message: "Failed to send mail" };
  }
}
