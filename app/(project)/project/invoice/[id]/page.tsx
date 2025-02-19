import { getInvoiceById, getPayementById } from '@/actions/payments'
import Invoice from '@/components/Invoice';
import { Button } from "@/components/ui/button";
import { getAuthUser } from '@/config/useAuth';
import { getNormalDate } from '@/lib/getNormalDate'
import { ChevronLeft, CloudDownload, Mail, Printer } from 'lucide-react'
import Email from 'next-auth/providers/email';
import Link from 'next/link';
import { notFound } from 'next/navigation'
import React from 'react'
import { MdEmail } from 'react-icons/md';

export default async function page({ params: { id },searchParams }: { params: { id: string };
searchParams : {[key : string]:string | string[]|undefined} }) {
    const {project} = searchParams
    if (!id) {
        return notFound()
    }
    const user  =await getAuthUser()
    const role = user?.role ?? ""
    const invoiceDetails = await getInvoiceById(id)
    if (!invoiceDetails?.client || !invoiceDetails?.user) {
        return notFound()
    }
    
    return (
        <>
        <Invoice role = {role} project={project as string} invoiceDetails={invoiceDetails} />
        </>

    )
}
