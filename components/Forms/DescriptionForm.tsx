"use client";

import React, { useState } from "react";
import TextArea from "../FormInputs/TextAreaInput";
import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";

export type SelectOptionProps = {
  label: string;
  value: string;
};

export default function DescriptionForm({
  editingId,
  initialDescription,
}: {
  editingId?: string | undefined;
  initialDescription?: string | undefined | null;
}) {
  const [content, setContent] = useState<any>(
      initialDescription
    );
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
  const [loading, setLoading] = useState(false);
  

  async function updateDescription(data: ProjectProps) {
    try {
      setLoading(true);

      // ✅ Ensure `data` is valid before calling the API
      if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        console.error("Invalid payload: data is null or empty", data);
        toast.error("Invalid form data. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Updating project with ID:", editingId, "Payload:", data);

      if (editingId) {
        await updateProjectById(editingId, data); // ✅ Now correctly calling the function
        toast.success("Updated Successfully!");
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
    <form className="" onSubmit={handleSubmit(updateDescription)}>
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
