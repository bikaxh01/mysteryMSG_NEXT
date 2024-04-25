"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { ApiResponse } from "@/app/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateCode } from "@/validationSchema/verifyuser.valid";

function page() {
  const [loading, setLoding] = useState(false);
  const params = useParams<{ username: string }>();
  //@ts-ignore
   const username:any = params.verify[0]
   

  const { toast } = useToast();
  const router = useRouter();

  // zod validation
  const form = useForm({
    resolver: zodResolver(validateCode),
    defaultValues: {
     code:''
    },
  });

  // handling form submit
  const onSubmit = async (data: any) => {
    
    const {code} = data;
    try {
      setLoding(true)
      const response = await axios.post("/api/verifyCode", {
        username:username,
        code
      });
      // displaying toast
      await toast({
        title: "SUCCESS",
        description: response.data.message,
      });
      router.replace(`/dashboard`);
    } catch (error) {
      setLoding(false)
      const axiosError = error as AxiosError<ApiResponse>;
      await toast({
        title: "ERROR",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
             Submit 
            </Button>
          </form>
        </Form>
        </div>
      </div>
  );
}

export default page;
