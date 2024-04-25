"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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
import { signInValidation } from "@/validationSchema/signIn.valid";
import { signIn } from "next-auth/react";

function SignInForm() {
  const [isSubmittingLoader, setIsSubmmitingLoader] = useState(false);

  const { toast } = useToast();
  const router = useRouter();


  // zod validation
  const form = useForm({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      password: "",
      identifier: "",
    },
  });
 
  // handling form submit
  const onSubmit = async (data: any) => {
    
     setIsSubmmitingLoader(true)
     const response = await signIn("credentials",{
      redirect:false,
      identifier : data.identifier,
      password:data.password
     })

     console.log(`response ${response}`);

     if(response?.error){
      await toast({
        title: "Error",
        description: response.error,
        variant:"destructive"
      });
      setIsSubmmitingLoader(false)
     }
     console.log(response);
     
     if (response?.url) {
      router.replace('/dashboard');
    }
     setIsSubmmitingLoader(false)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmittingLoader}>signin</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignInForm;
