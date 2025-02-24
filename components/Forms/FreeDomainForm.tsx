"use client";

import React, { useState, useEffect } from "react";
import TextArea from "../FormInputs/TextAreaInput";
import { ProjectProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { Link } from "lucide-react";

export default function FreeDomainForm({
  editingId,
  initialDomain,
  onUpdateSuccess, // ✅ Added callback to exit edit mode
}: {
  editingId?: string;
  initialDomain?: string | null;
  onUpdateSuccess?: (newDomain : string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialDomain || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      freeDomain : initialDomain || "",
    },
  });

  const router = useRouter();

  // ✅ Sync `content` when `initialDescription` changes
  useEffect(() => {
    setContent(initialDomain || "");
    reset({ freeDomain: initialDomain || "" });
  }, [initialDomain, reset]);
  async function updateDescription(data: ProjectProps) {
    try {
      setLoading(true);
  
      if (!data || !editingId) {
        toast.error("Invalid form data.");
        return;
      }
  
      console.log("Updating project with ID:", editingId, "Payload:", data);
      await updateProjectById(editingId, data);
  
      toast.success("Free Domain Updated!");
      router.refresh();
  
      // ✅ Pass the updated domain value back to `DomainCard.tsx`
      if (onUpdateSuccess) onUpdateSuccess(data.freeDomain??"");
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
        <TextInput
          register={register}
          errors={errors}
          label="Free Domain"
          name="freeDomain"
          icon={Link}
          placeholder="http://test.vercel.app"
        />
        <SubmitButton size="sm" title="Update" loading={loading} />
      </div>
    </form>
  );
}
