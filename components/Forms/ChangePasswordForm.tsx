"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordInput from "../FormInputs/PasswordInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateSlug } from "@/lib/generateSlug";
import toast from "react-hot-toast";
import { User, Lock, Mail, Headset, Flag, MapPin, Building, Pencil, Headphones, Phone, LockOpen } from "lucide-react";
import { UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createClient, updateClientById } from "@/actions/clients";
import { createUser, updateUserById, updateUserPassword } from "@/actions/users";

export type PasswordProps = {
  oldPassword : string,
  newPassword : string
}

type SelectOptionProps = {
  label: string;
  value: string;
};

type ClientsFormProps = {
  editingId?: string | undefined;
  initialData?: Partial<UserProps> | undefined | null;
};

export default function ChangePasswordForm({
  editingId,
  initialData
}: ClientsFormProps)
 {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordProps>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
const [passErr, setPassErr] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  async function onSubmit(data: PasswordProps) {
    setLoading(true);
    
    try {

      if (editingId) {
        // Update client
        const res = await updateUserPassword(editingId, data);
        if (res?.status=== 403) {
          setPassErr(res?.error as string)
          return
        }
        if (res?.status===200) {
          toast.success("Password updated successfully!");
          setLoading(false);
          reset();
        }
      } 

      // Reset form and navigate
      
    } catch (error) {
      setLoading(false);
      console.error("Error saving user:", error);
      toast.error("An error occurred while Changing Password");
    }
  }


  return (
    <form className="m-6" onSubmit={handleSubmit(onSubmit)}>

      <div className="grid grid-cols-12 gap-6 ">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card className="bg-[#1E293B]">
            <CardContent>
          
          <div className="mt-2 pt-6 space-y-4">
          <TextInput
              register={register}
              errors={errors}
              label="Old Password"
              name="oldPassword"
              icon={LockOpen}
              placeholder="Old Password"
            />
            </div>
            <div className="mt-2 space-y-4">
          <PasswordInput
                          register={register}
                          errors={errors}
                          label="Password"
                          name="newPassword"
                          icon={Lock}
                          placeholder="New Password"
                        />
                        {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
          </div>
          
      <FormFooter
        href="/change-password"
        editingId={editingId}
        loading={loading}
        title="Password"
        parent=""
      />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
