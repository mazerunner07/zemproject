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
import { Bell, Link, Mail } from "lucide-react";
import { createSubscription } from "@/actions/subscribe";

export type SubscribeProps={
    email:string, 
    userId:string
}

export default function SubscribeForm({
  userId,
}: {
  userId?: string;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeProps>();

  const router = useRouter();

  // ✅ Sync `content` when `initialDescription` changes

  async function subscribe(data: SubscribeProps) {
    data.userId = userId ?? ""
    try {
      console.log("front",data)
      setLoading(true);
      await createSubscription(data);
  
      toast.success("Subscribe!!!");
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <form onSubmit={handleSubmit(subscribe)}>
      <div className="flex flex-wrap justify-center items-stretch gap-3">
        <TextInput
          register={register}
          errors={errors}
          label=""
          name="email"
          icon={Mail}
          placeholder="projectmin95@gmail.com"
        />
        <SubmitButton size="sm" className="h-10 mt-2 bg-blue-500 hover:bg-blue-600" title="subscribe" loading={loading} />
      </div>
    </form>
  );
}
