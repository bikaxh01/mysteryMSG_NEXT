"use client";

import { ApiResponse } from "@/app/types/ApiResponse";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { acceptMsgvalidate } from "@/validationSchema/acceptMsg.valid";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


function page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setSwitchLoading] = useState(false);

  const { toast } = useToast();

  // returns filtered messsage array
  const handleDeleteMessage = (messageID: string) => {
    setMessages(messages.filter((id) => id !== messageID));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMsgvalidate),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  const fetchMessageStatus = useCallback(async () => {
    try {
      setSwitchLoading(true);
      const response = await axios.get("/api/acceptMessage");

      //@ts-ignore
      setValue("acceptMessage", response.data.isAccepting);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "ERROR",
        description: axiosError.response?.data.message || "Error occured",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const getMessages = useCallback(
    async (refresh: boolean = false) => {
      try {
        setLoading(true);
        const response = await axios.get("api/get-messages");
        
        setMessages(response.data.data || []);

        if (refresh) {
          toast({
            title: "Refreshing",
          });
        }
      } catch (error) {
        console.log("no messages");
        const axiosError = error as AxiosError;
        //@ts-ignore
        setMessages(axiosError.response?.data);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    getMessages();
    fetchMessageStatus();
  }, [session, getMessages, fetchMessageStatus, setValue]);

  const handleSwitch = async () => {
    try {
      const response = await axios.post("api/acceptMessage", {
        acceptMessage: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong..🤔",
      });
    }
  };
  const user = session?.user;
  
  const profileUrl = `https://mystery-msg-next.vercel.app/u/${user?.username}`;

  const copyToClipboard = () => {
    toast({
      title:"Copied"
    })
    navigator.clipboard.writeText(profileUrl);
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            //@ts-ignore
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
