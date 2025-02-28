"use server";

import ClientInvitation, { InvitationProps } from "@/components/EmailTemplate/ClientInvitation";
import InvoiceLink, { InvoiceLinkProps } from "@/components/EmailTemplate/InvoiceLink";
import { getNormalDate } from "@/lib/getNormalDate";
import { db } from "@/prisma/db";
import { InvoiceDetails } from "@/types/types";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';
import { ExistingUser } from "./users";
import MemberInvitation from "@/components/EmailTemplate/MemberInvitation";
import { sendEmailList, sendGeneralEmail, sendToClientList } from "@/components/EmailTemplate/html";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendInvoiceLink(data: InvoiceDetails, invoiceLink: string) {
  try {
    // re_KxDo4AEZ_B5EcQCsMBA1g7C8sk89JYNo6
   
    const date = getNormalDate(data.invoice.date)
    const title = `Payment Invoice for The ${data.invoice.title} Made on ${date}`
    const preview = `Payment Invoice for The ${data.invoice.title} Made on ${date}`
    const username = data.user?.name ?? ""
    const clientMail = "projectmin95@gmail.com";
    await resend.emails.send({
      from: "ZemProject@resend.dev",
      to: clientMail,
      subject: `Invoice for The Payment Made on ${date}`,
      react: InvoiceLink({ invoiceLink, preview, title, username })
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
// re_KxDo4AEZ_B5EcQCsMBA1g7C8sk89JYNo6
export async function sendClientInvitation(data: InvitationProps) {
  
  try {
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const loginUrl = data.loginUrl
    await resend.emails.send({
      from: "Zem-Project@resend.dev",
      to: "projectmin95@gmail.com",
      subject: `Invitation to Collaborate on ${data.projectName}`,
      react: ClientInvitation({ clientName: data.clientName,
        projectName: data.projectName,
        loginEmail: data.loginEmail,
        loginPassword: data.loginPassword,
        loginUrl : data.loginUrl
      })
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export type InvitationDetailsProps = {
  projectName : string
  projectOwner : string
  projectOwnerId : string
  loginLink : string
}
export async function sendMemberInvitation(members: ExistingUser[],projectData : InvitationDetailsProps) {
  const mails = members.map((member)=>{
    return{
      from: "Zem-Project@resend.dev",
      to: "projectmin95@gmail.com",
      subject: `Invitation to ${projectData.projectName}`,
      react: MemberInvitation({ 
        memberName : member.name,
        projectOwner :  projectData.projectOwner,
        projectName: projectData.projectName,
        loginUrl : projectData.loginLink,
        
      })
    }
  })
  try {
    // const resend = new Resend(process.env.RESEND_API_KEY);
    members.map(async (member)=>{
      const res = await db.guestProject.create({
        data : {
          projectLink : projectData.loginLink,
          projectName : projectData.projectName,
          projectOwner : projectData.projectOwner,
          guestName : member.name,
          guestId:member.id,
          ownerId : projectData.projectOwnerId
        }
      })
      console.log(res)
    })
    // const loginUrl = data.loginUrl
    const res = await resend.batch.send(mails);
  } catch (error) {
    console.log(error);
    return null;
  }
}
export interface GeneralMailProps {
  subject: string;
  body: string;
  email: string|string[];
  recipientName: string;
  attachments?: { path: string; filename: string }[];
}
export async function sendSingleEmail(mailData: GeneralMailProps) {
  const { subject, body, email, recipientName ,attachments } = mailData;
  
  try {
    // Generate the HTML email template
    const htmlContent = sendGeneralEmail({
      subject,
      body,
      recipientName
    });

    // Send email to the recipient
    const { data, error } = await resend.emails.send({
      from: "Zem-Project@resend.dev",
      to: "projectmin95@gmail.com",
      subject,
      html: htmlContent,  // This is the key change - ensuring we pass HTML properly
      attachments,
    });

    if (error) {
      console.error("Error sending email:", data);
      return {
        error: error,
        status: 500,
        data: null
      };
    }

    return {
      error: null,
      status: 200,
      data: data
    };
  } catch (error) {
    console.error("Exception in sendSingleEmail:", error);
    return {
      error: error,
      status: 500,
      data: null
    };
  }
}
export async function sendToClient(mailData: GeneralMailProps) {
  const { subject, body, email } = mailData;
  const emails = email as string[]; // Ensure it's an array

  try {
    // Send emails concurrently
    const emailPromises = emails.map((recipient) => {
      const recipientName = recipient.split("@")[0]; // Fix variable name

      // Generate the HTML email template
      const htmlContent = sendToClientList({
        subject,
        body,
        recipientName
      });

      // Return the send email promise
      return resend.emails.send({
        from: "Zem-Project@resend.dev",
        to: recipient, // Properly passing the recipient email
        subject,
        html: htmlContent
      });
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);

    return {
      error: null,
      status: 200,
      data: results
    };
  } catch (error) {
    console.error("Exception in sendToAllSubs:", error);
    return {
      error: error,
      status: 500,
      data: null
    };
  }
}
export async function sendToAllSubs(mailData: GeneralMailProps) {
  const { subject, body, email } = mailData;
  const emails = email as string[]; // Ensure it's an array
  console.log(emails)
  try {
    // Send emails concurrently
    const emailPromises = emails.map((recipient) => {
      const recipientName = recipient.split("@")[0]; // Fix variable name

      // Generate the HTML email template
      const htmlContent = sendEmailList({
        subject,
        body,
        recipientName
      });

      // Return the send email promise
      return resend.emails.send({
        from: "Zem-Project@resend.dev",
        to: recipient, // Properly passing the recipient email
        subject,
        html: htmlContent
      });
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);

    return {
      error: null,
      status: 200,
      data: results
    };
  } catch (error) {
    console.error("Exception in sendToAllSubs:", error);
    return {
      error: error,
      status: 500,
      data: null
    };
  }
}

