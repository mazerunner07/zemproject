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
import { User, Lock, Mail, Headset, Flag, MapPin } from "lucide-react";
import { UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createClient, updateClientById } from "@/actions/clients";
import { createUser } from "@/actions/users";

type SelectOptionProps = {
  label: string;
  value: string;
};

type ClientsFormProps = {
  editingId?: string | undefined;
  userId?: string
  initialData?: Partial<UserProps> | undefined | null;
};

export default function ClientsForm({
  editingId,
  initialData,
  userId
}: ClientsFormProps)
 {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      country: initialData?.country || "",
      location: initialData?.location || "",
      role: initialData?.role || "CLIENT",
      password: initialData?.password || "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const initialImage = initialData?.image || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function saveClient(data: UserProps) {
    try {
      setLoading(true);

      // Add image URL to the data
      data.image = imageUrl;
      data.name = `${data.firstName} ${data.lastName}`;
      data.role = "CLIENT";
      data.userId = userId;

      if (editingId) {
        // Update client
        await updateClientById(editingId, data);
        toast.success("Client updated successfully!");
      } else {
        // Create client
        await createClient(data);
        toast.success("Client created successfully!");
      }

      // Reset form and navigate
      reset();
      setImageUrl("/placeholder.svg");
      setLoading(false);
      router.push("/dashboard/clients");
    } catch (error) {
      setLoading(false);
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving the client.");
    }
  }


  return (
    <form className="" onSubmit={handleSubmit(saveClient)}>
      <FormHeader
        href="/clients"
        parent=""
        title="Clients"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Clients Profile</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="First Name"
              name="firstName"
              icon={User}
              placeholder="first Name"
            />
            <TextInput
              register={register}
              errors={errors}
              label="Last Name"
              name="lastName"
              icon={User}
              placeholder="last Name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="Phone"
              name="phone"
              icon={Headset}
              placeholder="phone"
            />
            <div className="">
              <TextInput
                type="email"
                register={register}
                errors={errors}
                label="Email Address"
                name="email"
                icon={Mail}
                placeholder="email"
              />
              {emailErr && (
                <p className="text-red-500 text-xs mt-2">{emailErr}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <PasswordInput
            register={register}
            errors={errors}
            label="Password"
            name="password"
            icon={Lock}
            placeholder="password"
            type="password"
          />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Client Profile Image"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientProfileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/clients"
        editingId={editingId}
        loading={loading}
        title="Clients"
        parent=""
      />
    </form>
  );
}
