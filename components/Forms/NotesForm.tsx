"use client";

import React, { useState } from "react";
import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import Editor from "../Editor/advanced-editor";
import TextArea from "../FormInputs/TextAreaInput";

export type SelectOptionProps = {
  label: string;
  value: string;
};

export default function NotesForm({
  editingId,
  initialNotes,
}: {
  editingId?: string | undefined;
  initialNotes?: string | undefined | null;
}) {
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
  const [loading, setLoading] = useState(false);

  async function updateNotes(data: ProjectProps) {
    try {

      if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        console.error("Invalid payload: data is null or empty", data);
        toast.error("Invalid form data. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Updating project with ID:", editingId, "Payload:", data);

      if (editingId) {
        await updateProjectById(editingId, data);
        toast.success("Saved Successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(updateNotes)}>
      <div className="grid gap-3">
      <Editor initialValue={content} onChange={setContent} />
        <SubmitButton size="sm" title="Save" loading={loading} />
      </div>
    </form>
  );
}
