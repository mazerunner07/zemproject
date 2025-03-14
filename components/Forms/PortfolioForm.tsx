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
import { User, Lock, Mail, Headset, Flag, MapPin, Building, Pencil, Headphones, Phone, LayoutGrid, Link, Twitter, Linkedin, Instagram, Youtube, Github } from "lucide-react";
import { PortfolioProps, UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createClient, updateClientById } from "@/actions/clients";
import { createUser, updateUserById } from "@/actions/users";
import { createPortfolioProfile, updatePortfolioById } from "@/actions/portfolio";
import { PortfolioProfile } from "@prisma/client";
import { Session } from "next-auth";

type SelectOptionProps = {
  label: string;
  value: string;
};

type ClientsFormProps = {
  editingId?: string | undefined;
  initialData?: PortfolioProfile | undefined | null;
  session : Session|null
  count : number
};

export default function PortfolioForm({
  editingId,
  initialData,
  session,
  count
}: ClientsFormProps) {
  const user = session?.user;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioProps>({
    defaultValues: {
      email: initialData?.email || user?.email || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      name: initialData?.name || user?.name || "",
      projectCount: initialData?.projectCount || count || 0,
      bookingLink: initialData?.bookingLink || "",
      twitterUrl: initialData?.twitterUrl || "",
      youtubeUrl: initialData?.youtubeUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      githubUrl: initialData?.githubUrl || "",
    }
    ,
  });
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const initialImage = initialData?.profileImage || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const router = useRouter();
  async function saveClient(data: PortfolioProps) {
    setLoading(true);
    data.profileImage = imageUrl;
  
    // Ensure user ID exists
    if (!user?.id) {
      toast.error("User ID is missing!");
      setLoading(false);
      return;
    }
  
    data.userId = user.id; // Now safely assigning userId
    data.projectCount = parseFloat(data.projectCount.toString());
    try {
      if (editingId) {
        const res = await updatePortfolioById(editingId, data);
        router.refresh()
        toast.success("Updated successfully!");
      } else {
        const res = await createPortfolioProfile(data);
        toast.success("Successfully Created!");
        reset();
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving the client.");
    } finally {
      setLoading(false);
    }
  }
  


return (
  <form className="" onSubmit={handleSubmit(saveClient)}>

    <div className="grid grid-cols-12 gap-6 ">
      <div className="lg:col-span-8  col-span-full space-y-3">
        <Card className="dark:bg-[#0F172A]">
          <CardContent className="">

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
                label="Location"
                name="location"
                icon={Flag}
                placeholder="eg USA"
              />
            </div>
            <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                register={register}
                errors={errors}
                label="Full Name"
                name="name"
                icon={User}
                placeholder="Name"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Number of Projects"
                name="projectCount"
                icon={LayoutGrid}
                type="number"
                placeholder="0"
              />
            </div>
            <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                register={register}
                errors={errors}
                label="Google Calender Booking Link"
                name="bookingLink"
                icon={Link}
                placeholder=""
              />
              <TextInput
                register={register}
                errors={errors}
                label="Twitter"
                name="twitterUrl"
                icon={Twitter}
                placeholder="Twitter Link"
              />
            </div>
            <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                register={register}
                errors={errors}
                label="Linkedin Link"
                name="linkedinUrl"
                icon={Linkedin}
                placeholder="Linkedin Link"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Instagram"
                name="instagramUrl"
                icon={Instagram}
                placeholder="Instagram Link"
              />
            </div>
            <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                register={register}
                errors={errors}
                label="Youtube Link"
                name="youtubeUrl"
                icon={Youtube}
                placeholder="Youtube Link"
              />
              <TextInput
                register={register}
                errors={errors}
                label="Github"
                name="githubUrl"
                icon={Github}
                placeholder="Github Link"
              />
            </div>
            <div className="mt-2 space-y-4">
              <TextArea
                register={register}
                errors={errors}
                label="Write a Summary Statement"
                name="description"
              />
            </div>

          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-4  col-span-full ">
        <div className="grid  auto-rows-max items-start gap-4 ">
          <ImageInput
            title="Profile Logo"
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            endpoint="profileImage"
          />
        </div>
      </div>
    </div>
    <FormFooter
      href="/brand-setting"
      editingId={editingId}
      loading={loading}
      title="Portfolio Profile"
      parent=""
    />
  </form>
);
}
