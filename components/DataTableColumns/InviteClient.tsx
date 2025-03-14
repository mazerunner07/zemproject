import { getNormalDate } from "@/lib/getNormalDate";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { sendClientInvitation } from "@/actions/email";
import { InvitationProps } from "../EmailTemplate/ClientInvitation";
import { ClientData, ProjectData } from "@/types/types";

export default function InviteClient({
  row, 
}: {
  row: any;
}) {
  // const createdAt = row.getValue(`${accessorKey}`);
  // const date = getNormalDate(createdAt);
  // const originalDate = new Date(createdAt);

  // const day = originalDate.getDate();
  // const month = originalDate.toLocaleString("default", { month: "short" });
  // const year = originalDate.getFullYear();
  // const time = timeAgo(createdAt);
  // const pastDays = getPastDays(createdAt);

  const projectData:ProjectData = row;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [loading,setLoading] = useState(false)
  async function inviteClient() {
    const data:InvitationProps = {
      clientName: projectData.client.name,
      projectName: projectData.name,
      loginEmail: projectData.client.email ,
      loginPassword: projectData.client?.plain??"",
      loginUrl: `${baseUrl}/login?returnUrl=/project/${projectData.slug}`
    }
    console.log("data inside :",data)
    if(!projectData.client)
    {
      console.log("project client data" ,projectData.client)
      console.log("project data" ,projectData)
    }
    setLoading(true);
        try {
            const res = await sendClientInvitation(data)
            setLoading(false)
            toast.success("Invite Sent")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    console.log("invite sent")
  }
  return <Button disabled={loading} variant='default' onClick={inviteClient} className="bg-[#00B1F3] hover:bg-[#56cdf8] text-white">{loading ? "Sending..." : "Send Invite"} </Button>;
}
