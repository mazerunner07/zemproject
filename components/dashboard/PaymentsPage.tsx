'use client'
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Payment, Project } from "@prisma/client";
import { DetailedUserProjects } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export default function PaymentsPage({ userProjects }: { userProjects: DetailedUserProjects }) {
  const params = useSearchParams();
  const selectedProjectId = params.get("pId") ?? "";
  const selectedProject = userProjects.find((project) => project.id === selectedProjectId) || userProjects[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 bg-white dark:bg-[#1E293B] border rounded-lg text-gray-900 dark:text-gray-100">
      {/* Projects List */}
      <div className="md:col-span-4 border bg-[#F7F8FF] dark:bg-[#0F172A] p-3 rounded-lg">
        <h2 className="text-xl font-bold mb-4 ml-2">Projects</h2>
        <ScrollArea className="h-[500px] w-full rounded-md p-2">
          {userProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/payments?pId=${project.id}`}>
              <Card
                className={cn(
                  "hover:bg-slate-100 dark:hover:bg-[#152241] h-20 cursor-pointer p-4 flex items-center gap-4 hover:shadow-lg transition rounded-lg mb-2",
                  project.id === selectedProjectId ? "bg-blue-50 dark:bg-[#152241]" : "bg-white dark:bg-[#131d34]"
                )}
              >
                <Image
                  src={project.thumbnail ?? "./placeholder.svg"}
                  alt={project.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <span className="font-medium">{project.name}</span>
              </Card>
            </Link>
          ))}
        </ScrollArea>
      </div>

      {/* Payments List */}
      <div className="md:col-span-8 border bg-[#F7F8FF] dark:bg-[#0F172A] p-3 rounded-lg">
        <h2 className="text-xl font-bold mb-4 ml-2">Payments</h2>
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-lg shadow">
          {selectedProject ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payments for {selectedProject.name}</h3>
              <ScrollArea className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Invoice</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.payments?.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-blue-100 dark:hover:bg-[#0F172A] transition">
                        <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">#{payment.invoiceNumber}</td>
                        <td className="py-3 px-4">{payment.title}</td>
                        <td className="py-3 px-4">${payment.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <Button size="sm" asChild className="bg-[#00B1F3] hover:bg-[#56cdf8] text-gray-100">
                            <Link href={`/project/invoice/${payment.id}?project=${selectedProject.slug}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Invoice
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Select a project to view its payments.</p>
          )}
        </div>
      </div>
    </div>
  );
}