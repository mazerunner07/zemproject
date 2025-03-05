"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaFilePdf,
  FaImage,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFilePowerpoint,
  FaFileAlt,
} from "react-icons/fa";
import { MdTextSnippet } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { XCircle, Paperclip, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SunEditorComponent from "../FormInputs/SunEditorComponent";
import FormSelectInput from "../FormInputs/FormSelectInput";
import MultipleFileUpload from "../FormInputs/MultipleFileUploader";
import { Subscriber, User } from "@prisma/client";
import { FileProps } from "@/types/types";
import { Separator } from "../ui/separator";
import toast from "react-hot-toast";
import { GeneralMailProps, sendSingleEmail, sendToAllSubs, sendToClient } from "@/actions/email";
import { sub } from "date-fns";
import { useRouter } from "next/navigation";

export type MailProps = {
  to: string;
  subject: string;
  html: string;
  attachments: FileProps[];
};

function getFileIcon(extension: string | undefined) {
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaImage className="w-6 h-6 text-gray-600" />;
    case "doc":
    case "docx":
      return <FaFileWord className="w-6 h-6 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="w-6 h-6 text-green-500" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="w-6 h-6 text-orange-500" />;
    case "zip":
    case "gzip":
    case "tar":
      return <FaFileArchive className="w-6 h-6 text-yellow-600" />;
    case "txt":
      return <MdTextSnippet className="w-6 h-6 text-gray-500" />;
    default:
      return <FaFileAlt className="w-6 h-6 text-gray-500" />;
  }
}

export default function EmailCompose({
  clients,
  subscribers,
}: {
  clients: User[];
  subscribers: Subscriber[];
}) {
  const mailingSubs = subscribers.map((item) => ({
    label: item.email,
    value: item.email,
  }));
  const mailingClients = clients.map((item) => ({
    label: item.email,
    value: item.email,
  }));
  const allSubs = [{ label: "All Subscribers", value: "all-subs" }];
  const allClients = [{ label: "All Clients", value: "all-clients" }];
  const allEmails = [...allSubs, ...mailingSubs, ...allClients, ...mailingClients];
const router = useRouter();
  const [selectedRecipient, setSelectedRecipient] = useState(allEmails[0]);
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState<FileProps[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  function handleImageRemove(fileIndex: number) {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
  }
  
  const type = selectedRecipient.value === "all-subs" ? "subs":selectedRecipient.value === "all-clients" ? "clients" : "single";
  async function onSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const actualRecipient = [...subscribers.map((sub) => {
      return { name: sub.email.split("@")[0], email: sub.email }
    }), ...clients.map((item) => {
      return {
        name: item.name,
        email: item.email
      }
    })].find((item) => item.email === selectedRecipient.value);
  
    if (!content) {
      toast.error("Please add content to the email");
      setIsSubmitting(false);
      return;
    }
  
    if (!subject) {
      toast.error("Please add a subject to the email");
      setIsSubmitting(false);
      return;
    }
  
    let mailData: GeneralMailProps = {
      subject: subject,
      body: content,
      email: selectedRecipient.value,
      recipientName: actualRecipient?.name ?? "",
      attachments: files.length > 0 ? files.map((item) => ({
        path: item.url,
        filename: item.name
      })) : undefined,
    };
  if (type === "subs") {
    mailData = {
      subject:subject,
      body:content,
      email:mailingSubs.map((item)=>item.value),
      recipientName:actualRecipient?.name ?? "",

    }
    
  }
  if (type === "clients") {
    mailData = {
      subject:subject,
      body:content,
      email:mailingClients.map((item)=>item.value),
      recipientName:actualRecipient?.name ?? "",
    }
  }
    try {
      if (type==="single") {
        const res = await sendSingleEmail(mailData);
        if (res?.status === 200) {
          toast.success("Email Sent Successfully");
          setContent("");
          setFiles([]);
          setSubject("");
          router.refresh();
          
        }
        else {
         toast.error("Failed to send email: " + res.error);
       }
      }
      else if(type==="subs"){
        
        const res = await sendToAllSubs(mailData);
        if (res?.status === 200) {
          toast.success("Email Sent Successfully");
          setContent("");
          setFiles([]);
          setSubject("");
          router.refresh();
          
        }
        else {
         toast.error("Failed to send email: " + res.error);
       }
      }
      else if (type==="clients") {
        console.log("all client :",mailData);
        const res = await sendToClient(mailData);
        if (res?.status === 200) {
          toast.success("Email Sent Successfully");
          setContent("");
          setFiles([]);
          setSubject("");
          router.refresh();
          
        }
        else {
         toast.error("Failed to send email: " + res.error);
       }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email.");
    }
    finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg dark:bg-[#121212] text-[#E0E0E0] border dark:border-[#333333]">
  <CardHeader className="flex p-4 pb-3">
    <h2 className="text-lg text-black dark:text-white font-medium">New Message</h2>
  </CardHeader>
  <Separator className="bg-[#333333]" />
  
  <CardContent className="p-4 space-y-4">
    <FormSelectInput
      label="Select Recipients"
      options={allEmails}
      option={selectedRecipient}
      setOption={setSelectedRecipient}
      toolTipText="Add New Recipients"
      href="/dashboard/clients/new"
      
    />

    <div className="space-y-1">
      <label className="text-sm text-black dark:text-white font-medium">Subject</label>
      <Input
        placeholder="Type here..."
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="dark:bg-[#1E1E1E] border dark:border-[#333333] dark:text-[#E0E0E0] placeholder-gray-400"
      />
    </div>

    <SunEditorComponent
      label="Compose Mail"
      value={content}
      onChange={setContent}
      className="dark:bg-[#1E1E1E] border dark:border-[#333333] dark:text-[#E0E0E0]"
    />

    {files.length > 0 && (
      <div className="space-y-2">
        <div className="text-sm font-medium">Attachments</div>
        <div className="space-y-2">
          {files.map((file, i) => {
            const extension = file.name.split(".").pop();
            return (
              <div key={i} className="relative">
                <button
                  type="button"
                  onClick={() => handleImageRemove(i)}
                  className="absolute -top-2 -right-2 bg-[#272727] text-red-500 rounded-full p-1"
                >
                  <XCircle />
                </button>
                <div className="py-2 px-6 bg-[#1E1E1E] flex items-center border border-[#333333] rounded-md">
                  {getFileIcon(extension)}
                  <div className="ml-4">
                    <span className="block text-sm font-medium">{file.name}</span>
                    {file.size > 0 && (
                      <span className="text-xs text-gray-400">
                        {(file.size / 1000).toFixed(2)} KB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </CardContent>

  <CardFooter className="flex items-center justify-between px-4 py-2 border-t border-[#333333]">
    {type === "single" && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-black dark:text-[#E0E0E0]">
            <Paperclip />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#121212] border border-[#333333]">
          <DialogHeader>
            <DialogTitle>Upload your Files</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <MultipleFileUpload
              label="Add attachments"
              files={files}
              setFiles={setFiles}
              endpoint="mailAttachments"
            />
          </form>
        </DialogContent>
      </Dialog>
    )}

    <Button 
      onClick={onSubmit} 
      disabled={isSubmitting}
      className="flex items-center bg-blue-500 hover:bg-blue-600 dark:text-[#121212] px-4 py-2 rounded-lg"
    >
      {isSubmitting ? (
        <span>Sending...</span>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          <span>Send Email</span>
        </>
      )}
    </Button>
  </CardFooter>
</Card>

  );
}
