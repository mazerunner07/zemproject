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
import { Pen, Plus } from "lucide-react";
import { ModuleProps } from "@/types/types";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import toast from "react-hot-toast";
import { createModule, updateModuleById } from "@/actions/modules";

export default function ModuleForm({
  projectId,
  userId,
  userName,
  initialContent,
  editingId,
  onModuleAdded, // Callback function to trigger fetch after adding a module
}: {
  projectId: string;
  userId: string;
  initialContent?: string;
  userName: string;
  editingId?: string;
  onModuleAdded?: () => void; // Function to be called after a module is successfully added
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModuleProps>({
    defaultValues: {
      name: initialContent || ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function saveModule(data: ModuleProps) {
    data.userName = userName;
    data.projectId = projectId;
    data.userId = userId;

    try {
      setLoading(true);
      if (editingId) {
        await updateModuleById(editingId, data);
        toast.success("Module updated successfully!");
      } else {
        await createModule(data);
        toast.success("Module created successfully!");
        reset();
        if (onModuleAdded) onModuleAdded(); // Trigger fetchModules in parent component
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving module:", error);
      toast.error("Failed to save module.");
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
            <Button variant="outline" className="w-full bg-[#00B1F3] hover:bg-[#56cdf8] text-white" onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(saveModule)}>
            <div className="gap-6 py-8 space-y-3">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Module" : "Add New Module"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update the module details." : "Enter the new module details."}
                </DialogDescription>
              </DialogHeader>
              <Card>
                <CardContent className="p-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Module Name"
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
