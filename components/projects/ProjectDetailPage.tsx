"use client";

import {
  CalendarDays,
  Edit2,
  ChevronLeft,
  X,
  Eye,
  Trash,
} from "lucide-react";
import { useEffect } from "react";
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
import parse from "html-react-parser";
import NotesForm from "../Forms/NotesForm";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import ProjectBanner from './ProjectBanner';
import { ModeToggle } from "../mode-toggle";
import { AvatarMenuButton } from "../dashboard/AvatarMenuButton";
import CommentForm from "../Forms/CommentForm";
import { get } from "http";
import { getInitials } from "@/lib/generateInitials";
import ModuleForm from "../Forms/ModuleForm";
import { deleteModule } from "@/actions/modules";
import toast from "react-hot-toast";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Separator } from "../ui/separator";
import InviteClient from "../DataTableColumns/InviteClient";
import InviteMembers from "./InviteMembers";
import { ExistingUser } from "@/actions/users";
import { DomainCard } from "./DomainCard";
import PaymentDeleteButton from "./PaymentDeleteButton";

interface TimelineProps {
  startDate: string | Date;
  endDate: string | Date;
}
async function handleModuleDelete(id: string) {
  try {
    const res = await deleteModule(id)
    if (res?.ok) {
      toast.success("Module Deleted")
    }
  } catch (error) {

  }
}



const Timeline = ({ startDate, endDate }: TimelineProps) => {
  const [timelineStats, setTimelineStats] = useState({
    daysRemaining: 0,
    progressPercentage: 0,
    status: "",
    statusColor: "",
  });

  useEffect(() => {
    const calculateTimeline = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      const totalDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const progressPercentage = Math.min(Math.round((daysElapsed / totalDuration) * 100), 100);

      let status = "";
      let statusColor = "";

      if (daysRemaining < 0) {
        status = "Project Deadline Passed";
        statusColor = "text-red-500 dark:text-red-400";
      } else if (daysRemaining === 0) {
        status = "Deadline is today!";
        statusColor = "text-yellow-500 dark:text-yellow-400";
      } else if (daysRemaining <= 7) {
        status = "Deadline approaching soon";
        statusColor = "text-orange-500 dark:text-orange-400";
      } else {
        status = "On track";
        statusColor = "text-green-500 dark:text-green-400";
      }

      setTimelineStats({
        daysRemaining: Math.max(daysRemaining, 0),
        progressPercentage,
        status,
        statusColor,
      });
    };

    calculateTimeline();
    const interval = setInterval(calculateTimeline, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <CalendarDays className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          <div className="space-y-1">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Start: {new Date(startDate).toLocaleDateString()}
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Deadline: {new Date(endDate).toLocaleDateString()}
            </p>
            <p className={`font-semibold ${timelineStats.statusColor}`}>
              Status: {timelineStats.daysRemaining > 0
                ? `${timelineStats.daysRemaining} days remaining`
                : timelineStats.status}
            </p>
          </div>
        </div>

        <Progress value={timelineStats.progressPercentage} className="mt-4 bg-gray-200 dark:bg-gray-700" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {timelineStats.progressPercentage}% of timeline completed
        </p>
      </CardContent>
    </Card>
  );
};


export default function ProjectDetailsPage({
  session,
  projectData,
  existingUsers
}: {
  existingUsers : ExistingUser[]
  session: Session | null;
  projectData: ProjectData;
}) {
  const router = useRouter();
  const budget = projectData.budget ?? 1;
  const user = session?.user
  let role = user?.role
  if (user.id !== projectData.user.id) {
    role = "MEMBER"
  }
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
  async function handleLogout() {
    try {
      const response = await signOut({ redirect: false }); // Prevents automatic redirect
      router.push("/login"); // Manually redirect the user
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  
  const handleEdit = async (domainType: "freeDomain" | "customDomain", newDomain: string) => {
    try {
      const response = await fetch("/api/domains/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.id, domainType, newDomain }),
      });
  
      if (!response.ok) throw new Error("Failed to update domain");
  
      toast.success("Domain updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating domain");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="flex mb-3 justify-between">
        <div>
          {role === "USER" ? (
            <Button
              onClick={() => router.push("/dashboard/projects")}
              variant="outline"
              size="sm"
              className="bg-white/50 backdrop-blur-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          ) : (
            <Button
              onClick={handleLogout} 
              variant="outline"
              size="sm"
              className="bg-black/100 text-white backdrop-blur-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <ModeToggle />
          <AvatarMenuButton session={session ?? null} />
        </div>
      </div>

      <ProjectBanner
  bg={projectData.gradient}
  editingId={projectData.id}
  name={projectData.name}
  bannerImage={projectData.bannerImage ?? undefined} 
/>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <Card className="dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dark:text-gray-100">Project Description</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="ghost"
                size="icon"
                className="dark:hover:bg-gray-700"
              >
                {isEditing ? (
                  <X className="h-4 w-4 dark:text-gray-300" />
                ) : (
                  <Edit2 className="h-4 w-4 dark:text-gray-300" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="dark:text-gray-300">
              {isEditing ? (
                <DescriptionForm
                  editingId={projectData.id}
                  initialDescription={projectData.description}
                  onUpdateSuccess={() => setIsEditing(false)}
                />
              ) : (
                <p>{projectData.description || "No description provided."}</p>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="modules" className="w-full">
  <TabsList className="bg-gray-100 dark:bg-gray-800/50">
    <TabsTrigger
      value="modules"
      className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
    >
      Modules
    </TabsTrigger>
    <TabsTrigger
      value="notes"
      className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
    >
      Notes
    </TabsTrigger>
    <TabsTrigger
      value="comments"
      className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
    >
      Comments
    </TabsTrigger>
    <TabsTrigger
      value="payments"
      className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
    >
      Payments
    </TabsTrigger>
  </TabsList>

  {/* Notes Tab */}
  <TabsContent value="notes">
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-gray-900 dark:text-gray-100">Notes</CardTitle>
        <Button
          onClick={() => setIsEditingNotes(!isEditingNotes)}
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isEditingNotes ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditingNotes ? (
          <NotesForm
            editingId={projectData.id}
            initialNotes={projectData.notes}
            onUpdateSuccess={() => setIsEditingNotes(false)}
          />
        ) : (
          <div
            className="prose notes-container dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: projectData.notes
                ? projectData.notes
                    .replace(/(\n\s*){2,}/g, "\n")
                    .replace(/\n/g, "<br />")
                : "No notes available.",
            }}
          ></div>
        )}
      </CardContent>
    </Card>
  </TabsContent>

  {/* Comments Tab */}
  <TabsContent value="comments">
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          <div className="flex justify-between items-center">
            Comments
            <CommentForm
              projectId={projectData.id}
              userId={projectData.userId}
              userName={user.name}
              userRole={user.role}
            />
          </div>
        </CardTitle>
      </CardHeader>
      {projectData.comments.length > 0 ? (
        <CardContent>
          <div className="space-y-4">
            {projectData.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start space-x-4 group bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <Avatar>
                  <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {comment.userName}
                    </p>
                    <CommentForm
                      projectId={projectData.id}
                      userId={projectData.userId}
                      userName={user.name}
                      userRole={user.role}
                      editingId={comment.id}
                      initialContent={comment.content}
                    />
                  </div>
                  <div className="prose dark:prose-invert">{parse(comment.content)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <p className="ml-6 mb-4 text-gray-500 dark:text-gray-400">No Comment Yet</p>
      )}
    </Card>
  </TabsContent>

  {/* Modules Tab */}
  <TabsContent value="modules">
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          <div className="flex items-center justify-between">
            Project Modules
            <ModuleForm
              projectId={projectData.id}
              userId={user.id}
              userName={user.name}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          {projectData.modules.length > 0 ? (
            <div className="group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projectData.modules.map((module) => (
                <Card
                  key={module.id}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-900 dark:hover:to-gray-700 transition-colors cursor-pointer"
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium justify-between flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                      {module.name}
                      <div className="flex items-center gap-3">
                        <ModuleForm
                          editingId={module.id}
                          initialContent={module.name}
                          projectId={projectData.id}
                          userId={user.id}
                          userName={user.name}
                        />
                        <button
                          onClick={() => handleModuleDelete(module.id)}
                          className="opacity-0 transition-opacity ease-in-out group-hover:opacity-100"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                        <Link
                          className="opacity-0 transition-opacity ease-in-out group-hover:opacity-100"
                          href={`/project/modules/${module.id}?pId=${module.projectId}`}
                        >
                          <Eye className="dark:text-blue-600 w-4 h-4 text-purple-500" />
                        </Link>
                      </div>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-between">
              <div className="space-y-4 justify-center items-center">
                <h2 className="text-gray-900 dark:text-gray-100">No Modules yet</h2>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Payments Tab */}
  <TabsContent value="payments">
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          <div className="flex items-center justify-between">
            Invoices & Payments
            {role === "USER" && (
              <PaymentForm
                projectId={projectData.id}
                userId={projectData.userId}
                clientId={projectData.clientId}
                remainingAmount={remainingAmount}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="payments">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger
              value="payments"
              className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-gray-100"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="text-gray-700 dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-gray-100"
            >
              Invoices
            </TabsTrigger>
          </TabsList>
          <TabsContent value="invoices">
            <ul className="space-y-2">
              {projectData.payments.map((invoice) => (
                <li
                  key={invoice.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      #{invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <h1 className="text-gray-900 dark:text-gray-100">{invoice.title}</h1>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      ${invoice.amount.toLocaleString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`/project/invoice/${invoice.id}?project=${projectData.slug}`}
                        className="text-gray-700 dark:text-gray-300"
                      >
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
            <ul className="space-y-2">
              {projectData.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${payment.amount.toLocaleString()}
                    </span>
                    <PaymentDeleteButton paymentId={payment.id} />
                  </div>
                </li>
              ))}
              <Separator className="dark:bg-gray-700" />
              

<div className="flex text-sm items-center justify-between text-gray-900 dark:text-gray-100">
  <p>Payment Progress ({(paidAmount === 0) ? 0 : ((paidAmount * 100 / budget).toFixed(2))}%)</p>
  <p>${paidAmount} / ${budget}</p>
</div>

<div className="mt-4 w-full h-2 rounded-full bg-black/20 dark:bg-gray-700">
  <div
    className={`h-full rounded-full transition-all duration-500 ease-in-out ${
      paidAmount < budget * 0.7
        ? "bg-green-500"
        : paidAmount >= budget * 0.7 && paidAmount < budget
        ? "bg-orange-500"
        : "bg-red-500"
    }`}
    style={{
      width: `${Math.min((paidAmount / budget) * 100, 100)}%`,
    }}
  ></div>
</div>

<div className="flex text-sm items-center justify-between text-gray-900 dark:text-gray-100">
  <p>Paid: {paidAmount}</p>
  <p>Remaining: {budget - paidAmount}</p>
</div>
</ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
        </div>

        <div className="space-y-8">
  {/* Client Card */}
  <Card className="bg-white dark:bg-gray-900 text-black dark:text-white">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{role === "USER" ? "Client" : "User"} Details</CardTitle>
        {role === "USER" && <InviteClient row={projectData} />}
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        {role === "USER" ? (
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={projectData.client.image || "/placeholder.svg?text=AC"}
            />
            <AvatarFallback>
              {projectData.client.firstName.charAt(0)}
              {projectData.client.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-12 w-12">
            {projectData.user.id ? (
              <AvatarImage src={projectData.user.image ?? "/placeholder.svg?text=AC"} />
            ) : (
              <AvatarFallback>
                {projectData.user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        )}
        {role === "USER" ? (
          <div>
            <p className="font-semibold">{projectData.client.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectData.client.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectData.client.phone}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectData.client.companyName}</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">{projectData.user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectData.user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projectData.user.companyName || "Individual Client"}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
  
  {/* Team Members */}
  <Card className="bg-white dark:bg-gray-900 text-black dark:text-white">
    <CardHeader>
      <CardTitle>Team Members</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex -space-x-2 overflow-hidden">
        {projectData.members.map((member) => (
          <Avatar key={member.id} className="inline-block border-2 border-background">
            <AvatarImage src={`/placeholder.svg?text=${member.name.charAt(0)}`} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {role === "USER" && (
        <InviteMembers projectData={projectData} allMembers = {existingUsers.filter((member=>member.id!==user.id))} />
      )}
    </CardContent>
  </Card>
  
  {/* Project Budget */}
  <Card className="bg-white dark:bg-gray-900 text-black dark:text-white">
    <CardHeader>
      <CardTitle>Project Budget</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center space-x-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
          <p className="text-xl font-bold">${projectData.budget?.toLocaleString() ?? "N/A"}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid Amount</p>
          <p className="text-xl font-bold">${paidAmount?.toLocaleString() ?? "N/A"}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Budget</p>
          <p className={`text-xl font-bold ${remainingAmount < 0 ? "text-red-500" : "text-black dark:text-white"}`}>
            ${remainingAmount >= 0 ? remainingAmount.toLocaleString() : "Over Budget"}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full h-2 rounded-full bg-black/20 dark:bg-gray-700">
<div
  className={`h-full rounded-full transition-all duration-500 ease-in-out ${
    paidAmount < budget * 0.7
      ? "bg-green-500"
      : paidAmount >= budget * 0.7 && paidAmount < budget
      ? "bg-orange-500"
      : "bg-red-500"
  }`}
  style={{
    width: `${projectData.budget ? Math.min((paidAmount / budget) * 100, 100) : 0}%`,
  }}
></div>

      </div>
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round((paidAmount / (projectData.budget || 1)) * 100)}% of budget used
        </p>
        <p className={`text-sm font-medium ${paidAmount > (projectData.budget || 0) ? "text-red-500" : "text-green-500"}`}>
          {paidAmount > (projectData.budget || 0) ? "Over Budget" : "Within Budget"}
        </p>
      </div>
    </CardContent>
  </Card>
  
  {/* Timeline */}
  <Timeline startDate={projectData.startDate??""} endDate={projectData.endDate??""} />

  {/* Domain */}

  <DomainCard projectData={projectData} />


</div>

      </div>
    </div>
  );
}
