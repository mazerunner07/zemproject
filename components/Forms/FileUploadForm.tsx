"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Upload, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createFile } from "@/actions/fileManager";
import { FileProps as createFileProps } from "@/types/types";
import MultipleFileUpload, { FileProps } from "../FormInputs/MultipleFileUploader";
import SubmitButton from "../FormInputs/SubmitButton";

export default function FileUploadForm({ folderId }: { folderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileProps[]>([]);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (files.length === 0) {
      toast.error("Please add at least one file before submitting.");
      return;
    }

    const fileData: createFileProps[] = files.map((file) => ({
      name: file.name, // Ensure 'title' exists
      type: file.type,
      url: file.url, // Ensure correct property
      size: file.size, // Convert size if needed
      folderId: folderId,
    }));

try {
  setIsLoading(true);

      await createFile(fileData);
      toast.success("Files uploaded successfully!");
      setFiles([]); // Clear files
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload files.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span className="flex items-center justify-center">
            <Upload className="mr-2" /> Upload Files
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your Files</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <MultipleFileUpload
            label="Add Files"
            files={files}
            setFiles={setFiles}
            endpoint="fileUploads"
          />
          {isLoading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... Please wait
            </Button>
          ) : (
            <SubmitButton className="w-full"
              loading={isLoading}
              loadingTitle="Saving... Please Wait"
              title={files.length > 1 ? "Save Documents" : "Save Document"}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
