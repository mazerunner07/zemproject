"use client"

import { JSX, useState } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Upload, Plus, MoreVertical, Folder, FolderPlus, Calendar, HardDrive, FileType, Clock, File, AlignJustify, Menu, X } from "lucide-react"
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
import MultipleFileUpload from "../FormInputs/MultipleFileUploader";

const calculateStoragePercentage = (used: number, total: number) => {
  return (used / total) * 100
}

export default function FileManager({ userId, userFolders }: { userId: string, userFolders: UserFolder[] }) {
  const [selectedFile, setSelectedFile] = useState<PrismaFile | null>(null)
  const [activeFolder, setActiveFolder] = useState("Reports 2022")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const params = useSearchParams();
  const selectedFolderId = params.get("fId") ?? "";
  const selectedFolder = userFolders.find((folder) => folder.id === selectedFolderId) || userFolders[0];

  if (!selectedFolder) {
    return <p className="p-4 text-center text-gray-500">No folders available</p>;
  }

  const totalSpace = Number(((2 * 1073741824) / userFolders.length).toFixed(2))
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

  return (
    <div className="h-screen flex flex-col md:flex-row border rounded-lg p-6 dark:bg-[#1E293B]">
      {/* Mobile Folder Selector - Only on Mobile */}
      <div className="md:hidden p-4 flex items-center justify-between border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{selectedFolder.name}</span>
          <FileUploadForm folderId={selectedFolder.id} />
        </div>
      </div>

      {/* Left Sidebar - Mobile and Desktop */}
      <div className={cn(
        "fixed md:static dark:bg-[#0F172A] inset-y-0 left-0 z-50 w-72 bg-background border-r p-4 transform transition-transform md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:block" // Ensure sidebar is visible on desktop
      )}>
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Folders</h2>
          <FolderForm userId={userId} />
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 ">
            {userFolders.map((folder) => {
              const usedSpace = folder.files.reduce((acc, item) => {
                return acc + item.size
              }, 0)
              return (
                <Link
                  key={folder.name}
                  href={`/dashboard/file-manager?fId=${folder.id}`}
                  onClick={() => {
                    setActiveFolder(folder.name);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex flex-col p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-[#141f3a] transition-colors",
                    activeFolder === folder.name && "bg-blue-100 dark:bg-[#141f3a]",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-blue-500" />
                      <span>{folder.name}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground ml-8">
                    {folder.files.length} items · {formatBytes(usedSpace)}
                  </div>
                </Link>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden dark:bg-[#0F172A]">
        {/* Main Content Area */}
        <div className="p-4 overflow-y-auto">
          {/* <div className="rounded-lg border p-4 mb-4 dark:bg-[#1E293B]">
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
                  </div> */}
          <div className="relative bg-yellow-300 dark:bg-[#1E293B] p-5 mb-5 w-full" style={{ clipPath: 'polygon(51% 0, 66% 33%, 100% 34%, 100% 100%, 0 100%, 0% 60%, 0 0)', borderRadius: '2rem' }}>
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-lg font-semibold dark:text-white">🔘 Folders / {selectedFolder.name}</h2>
              <p className="text-sm text-gray-600 mt-1 dark:text-white/50">📅 {getNormalDate(selectedFolder.createdAt)}</p>
              <p className="text-sm text-gray-700 mt-1 dark:text-white/50">{formatBytes(usedSpace)} of {formatBytes(totalSpace)} used</p>
              {/* Progress Bar */}
              <div className="mt-4">
              <div className="h-2 w-full bg-secondary dark:bg-white rounded-full overflow-hidden">
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
              <div className="flex justify-between mt-2">
              <p className="text-sm mt-1 dark:text-white">{usagePercentage.toFixed(2)}% Storage Used</p>
            <FileUploadForm folderId={selectedFolder.id} />

              </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFolder.files.map((file, i) => (
              <button
                key={i}
                onClick={() => setSelectedFile(file)}
                className="p-4 rounded-lg border dark:bg-[#1E293B] bg-background hover:bg-accent transition-colors"
              >
                <div className="flex-col items-start justify-center mb-4">
                  <div className="flex justify-center items-center gap-2 p-2 rounded-lg shadow-sm bg-gray-50">
                    <Link href={file.url} className="" target="_blank">
                      {getFileIcon(file.type)}
                    </Link>
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
        <SheetContent className="w-full dark:bg-[#0F172A] sm:w-96 p-6">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <AlignJustify className="w-5 h-5 text-primary" /> File Information
            </SheetTitle>
          </SheetHeader>
          {selectedFile && (
            <div className="mt-6 space-y-4">
              {/** File Details */}
              <div className="flex dark:bg-[#1E293B] items-center gap-4 p-3 border rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">{getNormalDate(selectedFile.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center dark:bg-[#1E293B] gap-4 p-3 border rounded-lg shadow-sm">
                <HardDrive className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Size</div>
                  <div className="font-medium">{formatBytes(selectedFile.size)}</div>
                </div>
              </div>

              <div className="flex items-center dark:bg-[#1E293B] gap-4 p-3 border rounded-lg shadow-sm">
                {getFileIcon(selectedFile.type)}
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{selectedFile.type}</div>
                </div>
              </div>

              <div className="flex items-center dark:bg-[#1E293B] gap-4 p-3 border rounded-lg shadow-sm">
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