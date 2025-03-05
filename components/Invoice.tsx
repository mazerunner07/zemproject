'use client'
import { InvoiceDetails } from '@/types/types'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ChevronLeft, Mail, Printer } from 'lucide-react'
import { getNormalDate } from '@/lib/getNormalDate'
import { useReactToPrint } from 'react-to-print'
import { sendInvoiceLink } from '@/actions/email'
import toast from 'react-hot-toast'
import { usePathname } from 'next/navigation'
import BackBtn from './BackBtn'

export default function Invoice({ invoiceDetails, project, role }: { role: string, project: string, invoiceDetails: InvoiceDetails | null }) {
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: `Invoice For ${invoiceDetails?.client?.name}`,
        onBeforePrint: async () => console.log("before printing"),
        onAfterPrint: async () => console.log("after printing"),
        // removeAfterPrint: true
    })
    const [loading,setLoading] = useState(false)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const invoiceLink = `${baseUrl}/project/invoice/${invoiceDetails?.invoice.id}?project=${project}`
    async function handleSendInvoice() {
        setLoading(true);
        try {
            const res = await sendInvoiceLink(invoiceDetails as InvoiceDetails,invoiceLink)
            setLoading(false)
            toast.success("Invoice Sent")
            console.log('email send to :' ,res)

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    return (
        <div className="max-w-2xl  mx-auto p-8">
            <div className="flex mb-2 justify-between items-center">
                <Button asChild variant="outline" className=''>
                    <BackBtn />
                </Button>
                <div className="flex justify-end gap-x-2">
                    {role === "USER" && 
                    <Button disabled={loading} onClick={handleSendInvoice} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        {!loading && <Mail className="shrink-0 size-4" />}
                        {/* <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg> */}
                        {loading ? "Sending..." : "Send to Client"}
                    </Button>
                    }
                    <Button onClick={() => {
                        handlePrint(() => contentToPrint.current);
                        console.log("content :" ,contentToPrint.current)
                    }} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" >
                        <Printer className="shrink-0 size-4" />
                        {/* <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg> */}
                        Print
                    </Button>
                </div>
            </div>

            <div ref={contentToPrint} className="relative flex flex-col bg-white shadow-lg rounded-xl pointer-events-auto dark:bg-neutral-800">
                <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center rounded-t-xl dark:bg-[#121212]">





                    <figure className="absolute inset-x-0 bottom-0 -mb-px">
                        <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1920 100.1">
                            <path fill="currentColor" className="fill-white dark:fill-neutral-800" d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
                        </svg>
                    </figure>

                </div>

                <div className="relative z-10 -mt-12">

                    {/* <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                            <svg className="shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                                <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </span> */}
                    <img alt='userLogo' src={invoiceDetails?.user?.userLogo ?? "/placeholder.svg"} className='mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400' />
                </div>


                <div className="p-4 sm:p-7 overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <div className="">
                            <h3 id="hs-ai-modal-label" className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                                Bill From
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                {invoiceDetails?.user?.name}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                {invoiceDetails?.user?.email}
                            </p>
                            <p className="text-sm font-medium pt-3 dark:text-neutral-500">
                                Invoice Date:{" "}
                                <span className="text-muted-foreground">
                                    {getNormalDate(invoiceDetails?.invoice.date ?? new Date())}
                                </span>
                            </p>
                        </div>
                        <div className="">
                            <h3 id="hs-ai-modal-label" className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                                Bill To
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                                {invoiceDetails?.client?.name}
                            </p>

                            <p className="text-sm text-gray-500  dark:text-neutral-500">
                                {invoiceDetails?.client?.email}
                            </p>
                            <p className="text-sm pt-3 font-medium  dark:text-neutral-500">
                                Invoice #{" "}<span className="text-muted-foreground">
                                    {invoiceDetails?.invoice.invoiceNumber}
                                </span>
                            </p>
                        </div>
                    </div>


                    <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <div>
                            <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">Amount paid: </span>
                            <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
                                ${invoiceDetails?.invoice.amount.toLocaleString()}
                            </span>
                        </div>


                        <div>
                            <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">Date paid:</span>
                            <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">{getNormalDate(invoiceDetails?.invoice.date ?? new Date())}</span>
                        </div>


                        <div>
                            <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">Payment method:</span>
                            <div className="flex items-center gap-x-2">

                                <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200">{invoiceDetails?.invoice.method}</span>
                            </div>
                        </div>

                    </div>


                    <div className="mt-5 sm:mt-10">
                        <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">Summary</h4>

                        <ul className="mt-3 flex flex-col">
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                                <div className="flex items-center justify-between w-full">
                                    <span>{invoiceDetails?.invoice.title}</span>
                                    <span>${(invoiceDetails!.invoice.amount - invoiceDetails!.invoice.tax).toLocaleString()}</span>
                                </div>
                            </li>
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                                <div className="flex items-center justify-between w-full">
                                    <span>Tax fee</span>
                                    <span>${invoiceDetails?.invoice.tax.toLocaleString()}</span>
                                </div>
                            </li>
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                                <div className="flex items-center justify-between w-full">
                                    <span>Total Amount paid</span>
                                    <span>${invoiceDetails?.invoice.amount.toLocaleString()}</span>
                                </div>
                            </li>
                        </ul>
                    </div>





                    <div className="mt-5 sm:mt-10">
                        <p className="text-sm text-gray-500 dark:text-neutral-500">If you have any questions, please contact us at <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href={`mailto:${invoiceDetails?.user?.email}`}>{invoiceDetails?.user?.email}</a> or call at <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href={`tel:${invoiceDetails?.user?.phone}`}>{invoiceDetails?.user?.phone}</a></p>
                    </div>
                </div>

            </div>
        </div>
    )
}
