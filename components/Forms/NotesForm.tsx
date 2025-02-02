"use client";

import React, { useState, useEffect } from "react";
import TextArea from "../FormInputs/TextAreaInput";
import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";

export default function NotesForm({
  editingId,
  initialNotes,
  onUpdateSuccess, // ✅ Callback to close edit mode
}: {
  editingId?: string;
  initialNotes?: string | null;
  onUpdateSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialNotes || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      notes: initialNotes || "",
    },
  });

  const router = useRouter();

  // ✅ Sync notes when `initialNotes` changes
  useEffect(() => {
    setContent(initialNotes || "");
    reset({ notes: initialNotes || "" });
  }, [initialNotes, reset]);

  async function updateNotes(data: ProjectProps) {
    try {
      setLoading(true);

      if (!data || !editingId) {
        toast.error("Invalid form data.");
        return;
      }
      
      console.log("Updating notes for project ID:", editingId, "Payload:", data);
      await updateProjectById(editingId, data);

      toast.success("Notes updated successfully!");
      router.refresh();

      // ✅ Exit editing mode & update state
      if (onUpdateSuccess) onUpdateSuccess();
      setContent(data.notes || "");
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(updateNotes)}>
      <div className="grid gap-3">
        <TextArea
          register={register}
          errors={errors}
          label=""
          name="notes"
        />
        <SubmitButton size="sm" title="Update" loading={loading} />
      </div>
    </form>
  );
}
