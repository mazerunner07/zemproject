"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateProjectById } from "@/actions/projects";
import toast from "react-hot-toast";
import { Link } from "lucide-react";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { ProjectProps } from "@/types/types";

export default function CustomDomainForm({
  editingId,
  initialDomain,
  onUpdateSuccess, // ✅ Callback to update DomainCard
}: {
  editingId?: string;
  initialDomain?: string | null;
  onUpdateSuccess?: (newDomain: string) => void; // ✅ Pass updated domain
}) {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      customDomain: initialDomain || "",
    },
  });

  const router = useRouter();

  // ✅ Sync `initialDomain` with form state
  useEffect(() => {
    reset({ customDomain: initialDomain || "" });
  }, [initialDomain, reset]);

  async function updateCustomDomain(data: ProjectProps) {
    try {
      setLoading(true);

      if (!data?.customDomain?.trim() || !editingId) {
        toast.error("Custom domain cannot be empty.");
        return;
      }

      console.log("Updating project with ID:", editingId, "Payload:", data);
      await updateProjectById(editingId, data);

      toast.success("Custom Domain Updated!");
      router.refresh();

      // ✅ Pass updated domain back to `DomainCard`
      if (onUpdateSuccess) onUpdateSuccess(data.customDomain);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(updateCustomDomain)}>
      <div className="grid gap-3">
        <TextInput
          register={register}
          errors={errors}
          label="Custom Domain" // ✅ Fixed label
          name="customDomain"
          icon={Link}
          placeholder="https://yourdomain.com"
        />
        <SubmitButton size="sm" title="Update" loading={loading} />
      </div>
    </form>
  );
}
