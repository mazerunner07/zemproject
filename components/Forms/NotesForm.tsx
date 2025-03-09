"use client";

import React, { useState, useEffect } from "react";
import TextArea from "../FormInputs/TextAreaInput";

import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import Editor from "../Editor/advanced-editor";


export default function NotesForm({
  editingId,
  initialNotes,
  isEditable,
  onUpdateSuccess, // ✅ Callback to close edit mode
}: {
  editingId?: string;
  isEditable?: boolean
  initialNotes?: string | null;
  onUpdateSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  // const [content, setContent] = useState(initialNotes || "");
  const [content, setContent] = useState<any>(
    initialNotes
  );
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
    console.log("content :", content)
    try {
      setLoading(true);

      if (!data || !editingId) {
        toast.error("Invalid form data.");
        return;
      }

      data.notes = JSON.stringify(content)
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
        {/* <TextArea
          register={register}
          errors={errors}
          label=""
          name="notes"
        /> */}
        <Editor isEditable = {isEditable} initialValue={content} onChange={setContent} />
        {isEditable && <SubmitButton size="sm" title="Update" loading={loading} />}
      </div>
    </form>
  );
}
