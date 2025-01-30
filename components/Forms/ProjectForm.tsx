"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateSlug } from "@/lib/generateSlug";
import toast from "react-hot-toast";
import { Project } from "@prisma/client";
import { ProjectProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import FormSelectInput from "../FormInputs/FormSelectInput";
import { createProject, updateProjectById } from "@/actions/projects";
import { convertDateToIso } from "@/lib/covertDataToIso";
import { convertIsoToDateString } from "@/lib/covertISODateToNorma";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ProjectFormProps = {
  editingId?: string | undefined;
  initialData?: Project | undefined | null;
  userId: string;
  clients: SelectOptionProps[]
};
export default function ProjectForm({
  editingId,
  initialData,
  userId,
  clients
}: ProjectFormProps) {  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      name: initialData?.name,
      description: initialData?.description || "",
      budget: initialData?.budget || 0,
      startDate: initialData?.startDate|| null,
      endDate: initialData?.endDate || null,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.thumbnail || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);

  const initMainClientId = initialData?.clientId;
  const initialClient = clients.find((user) => user.value === initMainClientId);

  const [selectClient, setSelectedClient] = 
  useState<any>(initialClient);
  async function saveProject(data: ProjectProps) {
    try {
      setLoading(true);
      const myStartDate = new Date(data.startDate); // Ensure it's a Date object
const myEndDate = new Date(data.endDate);

      if (isNaN(myStartDate.getTime()) || isNaN(myEndDate.getTime())) {
        setLoading(false);
        throw new Error("Invalid start or end date");
      }
      
      const differenceInTime = myEndDate.getTime() - myStartDate.getTime();
      const deadline = differenceInTime / (1000 * 60 * 60 * 24);
      data.deadline = Math.round(deadline);
      data.slug = generateSlug(data.name);
      data.thumbnail = imageUrl;
      data.userId = userId;
      data.clientId = selectClient.value
      data.startDate = convertDateToIso(data.startDate)
      data.endDate = convertDateToIso(data.endDate)
      data.budget = Number(data.budget);
      data.thumbnail = imageUrl;


      console.log(myEndDate);
      console.log(myEndDate);
      console.log("Payload being sent to createProject:", data);

      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
        //reset
        reset();
        //route
        router.push("/dashboard/projects");
        setImageUrl("/placeholder.svg");
      } else {
        const res = await createProject(data);
        if(res?.status === 409){
          toast.error(res.error)
        }else if(res?.status===200){
          setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
        setImageUrl("/placeholder.svg");
        //route
        router.push("/dashboard/projects");
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  // async function handleDeleteAll() {
  // setLoading(true);
  // try {
  // await deleteManyCategories();
  // setLoading(false);
  // } catch (error) {
  // console.log(error);
  // }
  // }
  console.log(status);

  return (
    <form className="" onSubmit={handleSubmit(saveProject)}>
      <FormHeader
        href="/project"
        parent=""
        title="Project"
        editingId={editingId}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="col-span-full lg:col-span-8">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Project Name"
                    name="name"
                  />  
                  </div>
                  <TextInput
              register={register}
              errors={errors}
              label="Project Budget"
              name="budget"
              type="number"
              placeholder="10000"
            />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    type="date"
                    label="Project Start Date"
                    name="startDate"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    type="date"
                    label="Project End Date"
                    name="endDate"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <TextInput
              register={register}
              errors={errors}
              label="Project Deadline (In weeks)"
              name="deadline"
              placeholder="eg 8 weeks"
            />
          </div>
                <div className="grid gap-3"></div>
                <FormSelectInput
                label="Clients"
                options = {clients}
                option={selectClient}
                setOption={setSelectedClient}
                toolTipText="Add New Client"
                href="/dashboard/clients/new"
                />
              </div>
              <div className="grid gap-3">
                <TextArea
                register={register}
                errors={errors}
                label="Project Description"
                name="description" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Project Thumbnail"
              imageUrl={imageUrl} 
              setImageUrl={setImageUrl}
              endpoint="projectImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/projects"
        editingId={editingId}
        loading={loading}
        title="Project"
        parent=""
      />
    </form>
  );
}


