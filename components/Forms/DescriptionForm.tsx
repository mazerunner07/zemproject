"use client";

import React, { useState, useEffect } from "react";
import TextArea from "../FormInputs/TextAreaInput";
import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";

export default function DescriptionForm({
  editingId,
  initialDescription,
  onUpdateSuccess, // ✅ Added callback to exit edit mode
}: {
  editingId?: string;
  initialDescription?: string | null;
  onUpdateSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialDescription || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      description: initialDescription || "",
    },
  });

  const router = useRouter();

  // ✅ Sync `content` when `initialDescription` changes
  useEffect(() => {
    setContent(initialDescription || "");
    reset({ description: initialDescription || "" });
  }, [initialDescription, reset]);

  async function updateDescription(data: ProjectProps) {
    try {
      setLoading(true);

      if (!data || !editingId) {
        toast.error("Invalid form data.");
        return;
      }

      console.log("Updating project with ID:", editingId, "Payload:", data);
      await updateProjectById(editingId, data);

      toast.success("Updated Successfully!");
      router.refresh();

      // ✅ Exit editing mode & update state
      if (onUpdateSuccess) onUpdateSuccess();
      setContent(data.description);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(updateDescription)}>
      <div className="grid gap-3">
        <TextArea
          register={register}
          errors={errors}
          label="Description"
          name="description"
        />
        <SubmitButton size="sm" title="Update" loading={loading} />
      </div>
    </form>
  );
}
