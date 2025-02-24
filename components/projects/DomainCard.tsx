"use client";

import { useState } from "react";
import { Copy, Edit2, Globe, MoreVertical, Save, Trash2, Verified, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { ProjectData } from "@/types/types";
import { Input } from "@/components/ui/input";
import FreeDomainForm from "../Forms/FreeDomainForm";
import CustomDomainForm from "../Forms/CustomDomainForm";

interface Domain {
  url: string;
  type: "vercel" | "custom";
  isVerified: boolean;
  isPrimary?: boolean;
}

interface DomainCardProps {
  projectData: ProjectData;
}

export function DomainCard({ projectData }: DomainCardProps) {
  const [isEditingFree, setIsEditingFree] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [freeDomain, setFreeDomain] = useState(projectData.freeDomain ?? "");
  const [customDomain, setCustomDomain] = useState(projectData.customDomain ?? "");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Domain copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Domains</CardTitle>
        <CardDescription>Manage the domains associated with {projectData.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Free Domain Section */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="rounded-full bg-gray-100 p-2">
              <Globe className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              {isEditingFree ? (
               <FreeDomainForm editingId={projectData.id} initialDomain={projectData.freeDomain} onUpdateSuccess={(newDomain) => {
                setFreeDomain(newDomain); // ✅ Update state after saving
                setIsEditingFree(false);
              }} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{freeDomain || "No Free domain available"}</span>
                  {freeDomain && <Verified className="h-4 w-4 text-green-500" />}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditingFree ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingFree(false)}>
                  <X className=" ml-4 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(freeDomain)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingFree(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>

              </>
            )}
          </div>
        </div>

        {/* Custom Domain Section */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="rounded-full bg-gray-100 p-2">
              <Globe className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              {isEditingCustom ? (
                <CustomDomainForm editingId={projectData.id} initialDomain={projectData.customDomain} onUpdateSuccess={(newDomain) => {
                  setCustomDomain(newDomain); // ✅ Update state after saving
                  setIsEditingCustom(false);
                }} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{customDomain || "No custom domain available"}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditingCustom ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingCustom(false)}>
                  <X className="ml-4 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(customDomain)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingCustom(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
