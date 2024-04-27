"use-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import axios from "axios";
  
interface Cardprops{
    message:any,
    onMessageDelete: (messageId:string) => void
}

function MessageCard({message,onMessageDelete}:Cardprops) {
  const {toast}= useToast();

  const handleDelete = async ()=>{
    const response = await axios.delete(`api/delete-message/${message.id}`);
    toast({
        title:response.data.message
    })
    onMessageDelete(message.id)
  }
  return (
    <Card className=" mt-4">
      <CardContent className=" mt-6 text-xl">
        <p>{message.content}</p>
      </CardContent>
      <CardFooter>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
