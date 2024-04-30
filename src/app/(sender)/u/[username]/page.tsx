"use client";

import { useToast } from "@/components/ui/use-toast";
import { messageValidation } from "@/validationSchema/message.valid";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function page() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      messageContent: "",
    },
  });

  const onSubmit = async ({messageContent}:any) => {
    try {
      setLoading(true)
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: messageContent,
      });
      await toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      await toast({
        title: "Error",
        //@ts-ignore
        description: axiosError.response?.data.message,
        variant:'destructive'
      });
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="container h-full w-full my-8 p-6  rounded max-w-4xl">
         <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="messageContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's your date of birth"
                  className="resize-none w-full"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Send Message
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>Submit</Button>
      </form>
    </Form>

   

    </div>
  );
}

export default page;
