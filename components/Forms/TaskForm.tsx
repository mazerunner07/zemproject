"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Pen, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import toast from "react-hot-toast";
import { createTask, updateTaskById } from "@/actions/tasks";
import { TaskProps } from "@/types/types";
import { TaskStatus } from "@prisma/client";

type TaskFormProps = {
  moduleId: string;
  initialTitle?: string;
  initialStatus: TaskStatus;
  editingId?: string;
  onTaskAdded?: () => void;
  isDefault?: boolean;
};

export default function TaskForm({
  moduleId,
  initialTitle = "",
  initialStatus,
  editingId,
  onTaskAdded,
  isDefault = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskProps>({
    defaultValues: { title: initialTitle },
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const saveTask = useCallback(
    async (data: TaskProps) => {
      const taskData = { ...data, moduleId, status: initialStatus };

      try {
        setLoading(true);
        if (editingId) {
          await updateTaskById(editingId, taskData);
          toast.success("Updated successfully!");
        } else {
          await createTask(taskData);
          toast.success("Successfully created!");
          reset();
        }

        setIsOpen(false);
        onTaskAdded?.();
      } catch (error) {
        console.error(error);
        toast.error("Error saving task.");
      } finally {
        setLoading(false);
      }
    },
    [moduleId, initialStatus, editingId, onTaskAdded, reset]
  );

  return (
    <div className="py-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {editingId ? (
            <Button variant="ghost" className="w-full dark:hover:bg-gray-700  hover:bg-green-100">
              <Pen className="h-4 w-4 mr-2 text-green-500" /> Edit
            </Button>
          ) : (
            <>
              {isDefault ? (
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="h-4 w-4" /> Add New Task
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-transparent border-2 border-white hover:bg-gray-50 text-black"
                  onClick={() => setIsOpen(true)} // Fix: Add onClick handler
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(saveTask)}>
            <div className="gap-6 py-8 space-y-3">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Task" : "Add New Task"}</DialogTitle>
              </DialogHeader>
              <Card>
                <CardContent>
                  <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label=""
                      name="title"
                      icon={Check}
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
