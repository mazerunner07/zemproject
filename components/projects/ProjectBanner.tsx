"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import ImageInput from "../FormInputs/ImageInput";
import { Link, Edit2, ChevronLeft, Edit, Pen } from "lucide-react";
import TextInput from "../FormInputs/TextInput";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SubmitButton from "../FormInputs/SubmitButton";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTitle } from "@/components/ui/dialog";
import { updateProjectById } from "@/actions/projects";
import Image from "next/image";

// ✅ Define the missing ProjectProps type
interface ProjectProps {
  bannerImage: string;
  name : string;
}

// ✅ Placeholder function for updating the project


const gradients = [
  "bg-gradient-to-r from-[#373B44] to-[#4286f4]",
  "bg-transparent bg-black/50",
  "bg-gradient-to-r from-[#141E30] to-[#243B55]",
  "bg-gradient-to-r from-[#fc466b] to-[#3f5efb]",
  "bg-gradient-to-r from-[#ff5f6d] to-[#ffc371]",
  "bg-gradient-to-r from-[#7F00FF] to-[#E100FF]",
  "bg-gradient-to-r from-[#ff512f] to-[#dd2476]",
  "bg-gradient-to-r from-[#00c6ff] to-[#0072ff]",
  "bg-gradient-to-r from-[#11998e] to-[#38ef7d]",
  "bg-gradient-to-r from-[#5643fa] to-[#f54ea2]",
  "bg-gradient-to-r from-[#00b4db] to-[#0083b0]",
  "bg-gradient-to-r from-[#1e3c72] to-[#2a5298]",
];

export default function ProjectBanner({
  bannerImage,
  name,
  editingId,
  bg,
  isPrivate=true
}: {
  bannerImage: string | undefined;
  name: string;
  editingId?: string;
  bg: string | null;
  isPrivate?: boolean;
}) {
  const router = useRouter();
  const [gradient, setGradient] = useState(bg || gradients[0]);
  const [imageUrl, setImageUrl] = useState(bannerImage || "/placeholder.svg");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [projectName,setProjectName] = useState(name);

  const { register,reset, handleSubmit, formState: { errors } } = useForm<ProjectProps>({
    defaultValues: { bannerImage: "", name : projectName },
  });

  async function handleGradientClick(newGradient: string) {
    setGradient(newGradient);
    const data = {
      gradient: newGradient,
      bannerImage: null,
    }
    setGradient(newGradient);
    setImageUrl("/placeholder.svg");
    if (!editingId) return;
    try {
      setLoading(true);
      await updateProjectById(editingId, data);
      toast.success("Gradient updated successfully!");
    } catch (error) {
      toast.error("Failed to update gradient");
    } finally {
      setLoading(false);
    }
  }

  async function handleBannerUpdate() {
    try {
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, { bannerImage: imageUrl ,gradient: gradients[1]  });
        toast.success("Banner Updated");
        setGradient(gradients[1]);
      }
    } catch (error) {
      toast.error("Banner update failed");
    } finally {
      setLoading(false);
    }
  }

  async function updateBannerByUrl(data: ProjectProps) {
    try {
      setImageUrl(data.bannerImage)
      setLoading(true);
      if (!editingId) {
        toast.error("Invalid form data.");
        return;
      }
      await updateProjectById(editingId, { 
        ...data, 
        gradient: gradients[1] 
      });
      setGradient(gradients[1]);
      toast.success("Banner Updated!");
      reset()
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  }
  async function updateProjectTitle(data: ProjectProps) {
    try {
      setLoading(true);
      if (!editingId) {
        toast.error("Invalid form data.");
        return;
      }
      await updateProjectById(editingId, data);
      
      setProjectName(data.name);
      toast.success("Title Updated!");
      reset();
      setEditing(false)
    } catch (error) {
      toast.error("Failed to update Title");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("relative w-full group h-48 rounded-lg mb-8 overflow-hidden", gradient)}>
      <Image
      width={300}
      height={300}
        src={imageUrl || "/placeholder.svg?height=192&width=1024"}
        alt={name}
        className="w-full h-full object-cover mix-blend-overlay"
      />

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className=" flex items-center">
          {editing && isPrivate ? (<form onSubmit={handleSubmit(updateProjectTitle)} className="flex max-w-[600px] items-center gap-3">
            <TextInput
              register={register}
              errors={errors}
              label=""
              name="name"
              placeholder=""
              className=""
            />
            <SubmitButton className="mt-2" size="sm" title="Update" loading={loading} />
          </form>):
           <h1 className="text-4xl font-bold text-white">{projectName}</h1>
          }

          {!editing && isPrivate && ( <Button onClick={()=>{
          setEditing(true); reset({name:projectName});
          }} variant="link" size="icon" className="">
            <Pen className="h-4 w-4 text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
            {/* <Pen className="h-4 w-4 text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" /> */}
          </Button>)}
        </div>
          <Sheet>
            {!editing && isPrivate && (
              <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white border opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 hover:bg-white/20">

              <Edit className="h-4 w-4" />

            </Button>
            </SheetTrigger>
            )}
          <SheetContent>
            <SheetHeader>
              <DialogTitle>Edit Project Banner</DialogTitle>
              <Tabs defaultValue="gradient" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="gradient">Gradient</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="link">Link</TabsTrigger>
                    <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                </TabsList>
                <TabsContent value="gradient">
                <Card>
  <CardHeader>
    <CardTitle className="mb-3">Choose a Gradient</CardTitle>

    {/* Gradient Options */}
    <div className="grid grid-cols-3 gap-4 px-3">
      {gradients.map((item, i) => (
        <button
          key={i}
          onClick={() => handleGradientClick(item)}
          className={cn(
            "w-20 h-20 rounded-2xl shadow-lg transition-all",
            item,
            gradient === item ? "scale-110 ring-2 ring-blue-500" : ""
          )}
        />
      ))}
    </div>
  </CardHeader>
</Card>

                </TabsContent>
                <TabsContent value="upload">
                  <Card>
                    <CardHeader>
                      <CardTitle className="mb-2">Upload Image</CardTitle>
                      <div className="grid gap-4">
                        <ImageInput
                          title=""
                          imageUrl={imageUrl}
                          setImageUrl={setImageUrl}
                          endpoint="bannerImage"
                        />
                        <Button disabled={loading} onClick={handleBannerUpdate}>
                          {loading ? "Updating..." : "Update Banner Image"}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </TabsContent>
                <TabsContent value="link">
                  <Card>
                    <CardHeader>
                      <CardTitle className="mb-2">Enter Image URL</CardTitle>
                      <form onSubmit={handleSubmit(updateBannerByUrl)} className="grid gap-3">
                        <TextInput
                          register={register}
                          errors={errors}
                          label=""
                          name="bannerImage"
                          placeholder="Enter Your Image URL"
                          icon={Link}
                        />
                        <SubmitButton size="sm" title="Update Banner Image" loading={loading} />
                      </form>
                    </CardHeader>
                  </Card>
                </TabsContent>
                <TabsContent value="unsplash">
                  <Card>
                    <CardHeader>
                      <CardTitle className="mb-2">Unsplash</CardTitle>
                      <h2 className="">waiting for access api</h2>
                      {/*<div className="grid grid-cols-2 gap-4 px-3">
                      {gradients.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleGradientClick(item)}
                          className={cn(
                            "w-32 h-20 rounded-2xl shadow-lg transition-all",
                            item,
                            gradient === item ? " scale-110" : ""
                          )}
                        />
                      ))}
                    </div>*/}
                    </CardHeader>
                  </Card>
                </TabsContent>
              </Tabs>
            </SheetHeader>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
}
