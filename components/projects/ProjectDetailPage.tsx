"use client";

import {
  CalendarDays,
  DollarSign,
  Edit2,
  MessageSquare,
  Users,
  ChevronLeft,
  Plus,
  X,
  Link,
  Eye,
  EyeIcon,
} from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import type { ProjectData } from "@/types/types";
import PaymentForm from "../Forms/PaymentForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import emptyfolder from "/public/empty-folder.png";
import DescriptionForm from "../Forms/DescriptionForm";
import { useState } from "react";
import NotesForm from "../Forms/NotesForm";
import ProjectBanner from './ProjectBanner';
import { ModeToggle } from "../mode-toggle";
import { AvatarMenuButton } from "../dashboard/AvatarMenuButton";

export default function ProjectDetailsPage({
  session,
  projectData,
}: {
  session: Session | null;
  projectData: ProjectData;
}) {
  const router = useRouter();

  const [desc, setDesc] = useState(projectData.description);
  const [note, setNote] = useState(projectData.notes);
  const paidAmount = projectData.payments.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);
  const remainingAmount = projectData.budget ? projectData.budget - paidAmount : 0
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!projectData) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="flex mb-3 justify-between">
        <div>
          <Button
            onClick={() => router.push("/dashboard/projects")}
            variant="outline"
            size="sm"
            className="bg-white/50 backdrop-blur-sm
             dark:bg-black dark:border-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>


        </div>
        <div className="flex gap-3">
          <ModeToggle />
          <AvatarMenuButton session={session} />
        </div>
      </div>
      <ProjectBanner bg={projectData.gradient} editingId={projectData.id} name={projectData.name} bannerImage={projectData.bannerImage} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Project Description</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="ghost"
                size="icon"
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <DescriptionForm
                  editingId={projectData.id}
                  initialDescription={projectData.description}
                  onUpdateSuccess={() => setIsEditing(false)} // ✅ Exit edit mode on success
                />
              ) : (
                <p>{projectData.description || "No description provided."}</p>
              )}

            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Notes</CardTitle>
              <Button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                variant="ghost"
                size="icon"
              >
                {isEditingNotes ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <NotesForm
                  editingId={projectData.id}
                  initialNotes={projectData.notes}
                  onUpdateSuccess={() => setIsEditingNotes(false)} // ✅ Exit edit mode on success
                />
              ) : (
                <div className="prose notes-container"
                  dangerouslySetInnerHTML={{
                    __html: projectData.notes
                      .replace(/(\n\s*){2,}/g, '\n')  // Replaces multiple blank lines with a single blank line
                      .replace(/\n/g, "<br />") || "No notes available.", // Adds <br /> for each line break
                  }}></div>
              )}
            </CardContent>
          </Card>


          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={projectData.client.image || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {projectData.client.firstName.charAt(0)}
                        {projectData.client.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{projectData.client.name}</p>
                      <p className="text-sm text-gray-500">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Comment
          </Button>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Project Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                {projectData.modules.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {projectData.modules.map((module) => (
                      <Card
                        key={module.id}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-pointer"
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">
                            {module.name}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-between">
                    <div className="space-y-4 justify-center items-center">
                      <h2>No Modules yet</h2>
                      {/* <Image src={emptyfolder} alt="No Modules" className="w-36 h-auto"/> */}
                      <Button variant={"outline"}>Add Module</Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
              {/* Pagination for many modules */}
              <div className="flex justify-center mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Project Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Project Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center space-x-4">

                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-2xl font-bold">
                      ${projectData.budget?.toLocaleString() ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Paid Amount</p>
                    <p className="text-2xl font-bold">
                      ${paidAmount?.toLocaleString() ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <Progress value={65} className="mt-4" />
              <p className="text-sm text-gray-500 mt-2">65% of budget used</p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <CalendarDays className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">
                    Start:{" "}
                    {projectData.startDate
                      ? new Date(projectData.startDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p className="font-semibold">
                    Deadline:{" "}
                    {projectData.endDate
                      ? new Date(projectData.endDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p className="font-semibold">
                    Remaining: {projectData.deadline} days
                  </p>
                </div>
              </div>
              <Progress value={40} className="mt-4" />
              <p className="text-sm text-gray-500 mt-2">
                40% of project timeline completed
              </p>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 overflow-hidden">
                {projectData.members.map((member) => (
                  <Avatar
                    key={member.id}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage
                      src={`/placeholder.svg?text=${member.name.charAt(0)}`}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={projectData.client.image || "/placeholder.svg?text=AC"}
                  />
                  <AvatarFallback>
                    {projectData.client.firstName.charAt(0)}
                    {projectData.client.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{projectData.client.name}</p>
                  <p className="text-sm text-gray-500">
                    {projectData.client.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {projectData.client.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices and Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Invoices & Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payments">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices">
                  <ul className="space-y-2">

                    {projectData.payments.map((invoice) => (
                      <li
                        key={invoice.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
                      >
                        <div>
                          <p className="font-medium">#{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">
                            ${invoice.amount.toLocaleString()}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/project/invoice/${invoice.id}?project=${projectData.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="payments">
                  <PaymentForm projectId={projectData.id} userId={projectData.userId} clientId={projectData.clientId} remainingAmount={remainingAmount} />
                  <ul className="space-y-2">
                    {projectData.payments.map((payment) => (
                      <li
                        key={payment.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{payment.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-green-600">
                            ${payment.amount.toLocaleString()}
                          </span>
                          <Button variant="outline" size="sm" >
                            View Invoice
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
