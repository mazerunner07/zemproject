"use client"

import { JSX, useState } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Upload, Plus, MoreVertical, Folder, FolderPlus, Calendar, HardDrive, FileType, Clock, File, AlignJustify } from "lucide-react"
import {
  FaFilePdf,
  FaImage,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFilePowerpoint,
  FaFileAlt,
} from "react-icons/fa";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import FolderForm from "../Forms/FolderForm"
import { UserFolder } from "@/types/types"
import { useSearchParams } from "next/navigation"
import FileUploadForm from "../Forms/FileUploadForm"
import { File as PrismaFile } from "@prisma/client"
import { getNormalDate } from "@/lib/getNormalDate"
import { formatBytes } from "@/lib/formatBytes"
import formatUpdatedAt from "@/lib/formatUpdatedAt"
import { MdTextSnippet } from "react-icons/md";

// Add this before the component
const calculateStoragePercentage = (used: number, total: number) => {
  return (used / total) * 100
}

// interface Folder {
//   name: string
//   items: number
//   size: string
//   storage: {
//     used: number
//     total: number
//   }
// }


export default function FileManager({ userId, userFolders }: { userId: string, userFolders: UserFolder[] }) {
  const [selectedFile, setSelectedFile] = useState<PrismaFile | null>(null)
  const [activeFolder, setActiveFolder] = useState("Reports 2022")
  const params = useSearchParams();
  const selectedFolderId = params.get("fId") ?? "";
  const selectedFolder = userFolders.find((folder) => folder.id === selectedFolderId) || userFolders[0];
  if (!selectedFolder) {
    return <p className="p-4 text-center text-gray-500">No folders available</p>;
  }
  const totalSpace = Number(((2*1073741824) / userFolders.length).toFixed(2))
  const usedSpace = selectedFolder.files.reduce((acc, item) => {
    return acc + item.size
  }, 0)
  const usagePercentage = usedSpace * 100 / totalSpace;
  function getFileIcon(mimeType: string | undefined) {
    if (!mimeType) return <FaFileAlt className="w-6 h-6 text-gray-500" />;

    const iconMap: Record<string, JSX.Element> = {
      "application/pdf": <FaFilePdf className="w-6 h-6 text-red-500" />,
      "image/jpeg": <FaImage className="w-6 h-6 text-gray-600" />,
      "image/jpg": <FaImage className="w-6 h-6 text-gray-600" />,
      "image/png": <FaImage className="w-6 h-6 text-gray-600" />,
      "image/gif": <FaImage className="w-6 h-6 text-gray-600" />,
      "application/msword": <FaFileWord className="w-6 h-6 text-blue-500" />,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <FaFileWord className="w-6 h-6 text-blue-500" />,
      "application/vnd.ms-excel": <FaFileExcel className="w-6 h-6 text-green-500" />,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FaFileExcel className="w-6 h-6 text-green-500" />,
      "application/vnd.ms-powerpoint": <FaFilePowerpoint className="w-6 h-6 text-orange-500" />,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": <FaFilePowerpoint className="w-6 h-6 text-orange-500" />,
      "application/zip": <FaFileArchive className="w-6 h-6 text-yellow-600" />,
      "application/x-gzip": <FaFileArchive className="w-6 h-6 text-yellow-600" />,
      "application/x-tar": <FaFileArchive className="w-6 h-6 text-yellow-600" />,
      "text/plain": <MdTextSnippet className="w-6 h-6 text-gray-500" />,
    };

    return iconMap[mimeType] || <FaFileAlt className="w-6 h-6 text-gray-500" />;
  }

  // Update the folders data


  // const files: File[] = [
  //   {
  //     name: "Contracts_320_2022.pdf",
  //     type: "PDF",
  //     created: "2/10/2022",
  //     size: "120.5 MB",
  //     lastModified: "11/10/2022 - 10:30",
  //   },
  //   {
  //     name: "Contracts_320_2022.pdf",
  //     type: "XLS",
  //     created: "2/10/2022",
  //     size: "120.5 MB",
  //     lastModified: "11/10/2022 - 10:30",
  //   },
  //   // Add more files as needed
  // ]

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-72 border-r bg-background p-4">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Folders</h2>
          <FolderForm userId={userId} />
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {userFolders.map((folder) => {
              const usedSpace = folder.files.reduce((acc, item) => {
                return acc + item.size
              }, 0)
              return(
                <Link
              key={folder.name}
              href={`/dashboard/file-manager?fId=${folder.id}`}
              onClick={() => setActiveFolder(folder.name)}
              className={cn(
                "flex flex-col p-2 rounded-lg hover:bg-blue-50",
                activeFolder === folder.name && "bg-blue-100",
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5  text-blue-500" />
                  <span>{folder.name}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="text-sm text-muted-foreground ml-8">
                {folder.files.length} items · {formatBytes(usedSpace)}
              </div>
              {/* <div className="mt-2 ml-8">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      calculateStoragePercentage(folder.storage.used, folder.storage.total) > 50
                        ? "bg-red-500"
                        : "bg-green-500",
                    )}
                    style={{
                      width: `${calculateStoragePercentage(folder.storage.used, folder.storage.total)}%`,
                    }}
                  />
                </div>
              </div> */}
            </Link>
              )
})}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">{selectedFolder.name}</h1>
          </div>
          <div className="flex gap-2">
            <FileUploadForm folderId={selectedFolder.id} />
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Folders / {selectedFolder.name}</div>
              <div className="text-sm text-muted-foreground">{formatBytes(usedSpace)} of {formatBytes(totalSpace)} used</div>
            </div>
            <div className="mb-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
  <div
    className={cn(
      "h-full transition-all rounded-full",
      usagePercentage > 90
        ? "bg-red-500"
        : usagePercentage > 50
          ? "bg-lime-500"
          : "bg-green-500"
    )}
    style={{ width: `${usagePercentage}%` }}
  />
</div>

            </div>

          </div>



          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFolder.files.map((file, i) => (
              <button
                key={i}
                onClick={() => setSelectedFile(file)}
                className="p-4 rounded-lg border bg-background hover:bg-accent transition-colors"
              >
                <div className="flex-col items-start justify-center mb-4">
                  <div className="flex justify-center items-center gap-2 p-2 rounded-lg shadow-sm bg-gray-50">
                    {getFileIcon(file.type)}
                  </div>
                </div>
                <div className="text-sm font-medium truncate">{file.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Info Sheet */}
      <Sheet open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <SheetContent className="w-96 p-6">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <AlignJustify className="w-5 h-5 text-primary" /> File Information
            </SheetTitle>
          </SheetHeader>
          {selectedFile && (
            <div className="mt-6 space-y-4">
              {/** File Details */}
              <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">{getNormalDate(selectedFile.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                <HardDrive className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Size</div>
                  <div className="font-medium">{formatBytes(selectedFile.size)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                {getFileIcon(selectedFile.type)}
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{selectedFile.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Last Modified</div>
                  <div className="font-medium">{formatUpdatedAt(selectedFile.updatedAt)}</div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

