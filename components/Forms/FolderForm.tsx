import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderPlus, Pen, Plus } from "lucide-react";
import { FolderProps, ModuleProps } from "@/types/types";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import toast from "react-hot-toast";
import { createModule, updateModuleById } from "@/actions/modules";
import { createFolder, updateFolderById } from "@/actions/fileManager";

export default function FolderForm({

  userId,

  initialContent,
  editingId,
  onModuleAdded, // Callback function to trigger fetch after adding a module
}: {

  userId: string;
  initialContent?: string;
  editingId?: string;
  onModuleAdded?: () => void; // Function to be called after a module is successfully added
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FolderProps>({
    defaultValues: {
      name: initialContent || ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function saveFolder(data: FolderProps) {
    data.userId = userId;

    try {
      setLoading(true);
      if (editingId) {
        await updateFolderById(editingId, data);
        toast.success("updated successfully!");
      } else {
        await createFolder(data);
        toast.success("created successfully!");
        reset();
        if (onModuleAdded) onModuleAdded(); // Trigger fetchModules in parent component
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving module:", error);
      toast.error("Failed to save folder.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {editingId ? (
            <button
              className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              onClick={() => setIsOpen(true)}
            >
              <Pen className="h-4 text-green-500 w-4 ml-2" />
            </button>
          ) : (
            <Button variant={"outline"} size="icon">
        <FolderPlus className="m-4 h-4" />
        </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(saveFolder)}>
            <div className="gap-6 py-8 space-y-3">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Folder" : "Add New Folder"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update Folder" : "Enter the new Folder."}
                </DialogDescription>
              </DialogHeader>
              <Card>
                <CardContent className="p-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Folder Name"
                    name="name"
                  />
                </CardContent>
                {/* <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label=""
                      name="name"
                      icon={Check}
                    /> */}
                {/* <IconInput 
                      onIconSelect={setSelectedIcon}
                      selectedIcon={selectedIcon}
                    /> */}
                {/* </div> */}
              </Card>
              <div className="py-3">
                <SubmitButton title={editingId ? "Update" : "Add"} loading={loading} />
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
