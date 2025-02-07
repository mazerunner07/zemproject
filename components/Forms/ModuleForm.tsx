import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Check, MessageSquare, Pen, Plus } from "lucide-react";
import { ModuleProps } from "@/types/types";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import IconInput from "../FormInputs/IconInput";
import toast from "react-hot-toast";
import { createModule, updateModuleById } from "@/actions/modules";

export default function ModuleForm({
  projectId,
  userId,
  userName,
  initialContent,
  editingId,
}: {
  projectId: string;
  userId: string;
  initialContent?: string;
  userName: string;
  editingId?: string;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModuleProps>({
    defaultValues: {
      name: initialContent || ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined);

  async function saveModule(data: ModuleProps) {
    data.userName = userName;
    data.projectId = projectId;
    data.userId = userId;
    

    try {
      setLoading(true);
      if (editingId) {
         await updateModuleById(editingId, data);
        toast.success("Updated successfully!");
      } else {
         await createModule(data);
        toast.success("Successfully created!");
        reset();
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving module.");
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
              <Pen className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
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
                  {/* Add description if needed */}
                </DialogDescription>
              </DialogHeader>
              <Card>
                <CardContent>
                  <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label=""
                      name="name"
                      icon={Check}
                    />
                    <IconInput 
                      onIconSelect={setSelectedIcon}
                      selectedIcon={selectedIcon}
                    />
                  </div>
                </CardContent>
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