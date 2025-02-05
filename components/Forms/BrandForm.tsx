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
import { User, Lock, Mail, Headset, Flag, MapPin, Building, Pencil, Headphones, Phone } from "lucide-react";
import { UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createClient, updateClientById } from "@/actions/clients";
import { createUser, updateUserById } from "@/actions/users";

type SelectOptionProps = {
  label: string;
  value: string;
};

type ClientsFormProps = {
  editingId?: string | undefined;
  initialData?: Partial<UserProps> | undefined | null;
};

export default function BrandForm({
  editingId,
  initialData
}: ClientsFormProps)
 {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      email: initialData?.country || "",
      phone: initialData?.country || "",
      country: initialData?.country || "",
      location: initialData?.location || "",
      companyName: initialData?.companyName || "",
      companyDescription: initialData?.companyDescription || ""
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const initialImage = initialData?.userLogo || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveClient(data: UserProps) {
    setLoading(true);
    data.userLogo=imageUrl
    try {

      if (editingId) {
        // Update client
        await updateUserById(editingId, data);
        toast.success("Client updated successfully!");
      } 

      // Reset form and navigate
      reset();
      setImageUrl("/placeholder.svg");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving the client.");
    }
  }


  return (
    <form className="m-6" onSubmit={handleSubmit(saveClient)}>

      <div className="grid grid-cols-12 gap-6 ">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="Email Address"
              name="email"
              icon={Mail}
              placeholder=""
            />
            <TextInput
              register={register}
              errors={errors}
              label="Phone"
              name="phone"
              icon={Phone}
              placeholder=""
            />
          </div>
          <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="Country"
              name="country"
              icon={Flag}
              placeholder="eg USA"
            />
            <TextInput
              register={register}
              errors={errors}
              label="Location"
              name="location"
              icon={MapPin}
              placeholder="eg Canada"
            />
          </div>
          
          <div className="mt-2 space-y-4">
          <TextInput
              register={register}
              errors={errors}
              label="Company Name"
              name="companyName"
              icon={Building}
              placeholder="Space Corp"
            />
            </div>
            <div className="mt-2 space-y-4">
          <TextInput
              register={register}
              errors={errors}
              label="Company Description"
              name="companyDescription"
              icon={Pencil}
              placeholder="Leading to Space Exploration"
            />
          </div>
          
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Brand Logo"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientProfileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/brand-setting"
        editingId={editingId}
        loading={loading}
        title="Brand Settings"
        parent=""
      />
    </form>
  );
}
