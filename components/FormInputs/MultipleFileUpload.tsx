import { UploadDropzone } from "@/lib/uploadthing";
import { Pencil, XCircle } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import {
  FaFilePdf,
  FaImage,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
} from "react-icons/fa";
import { MdTextSnippet } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { BsFileEarmarkRichtext, BsFileEarmarkSpreadsheet } from "react-icons/bs";

type FileProps = {
  title: string;
  type: string;
  size: number;
  url: string;
};

type MultipleFileUploadProps = {
  label: string;
  files: FileProps[];
  setFiles: (files: FileProps[]) => void;
  className?: string;
  endpoint: keyof EndpointArg<{ 
    projectImage: FileRoute;
    clientProfileImage: FileRoute;
    mailAttachments: FileRoute;
  }>;
};

export function getFileIcon(extension: string | undefined) {
  switch (extension?.toLowerCase()) {
    case "pdf":
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
      return <FaImage className="w-6 h-6 text-gray-600" />;
    case "doc":
    case "docx":
      return <FaFileWord className="w-6 h-6 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="w-6 h-6 text-green-500" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="w-6 h-6 text-orange-500" />;
    case "zip":
    case "gzip":
    case "tar":
    case "rar":
      return <FaFileArchive className="w-6 h-6 text-yellow-600" />;
    case "txt":
      return <MdTextSnippet className="w-6 h-6 text-gray-500" />;
    case "csv":
      return <BsFileEarmarkSpreadsheet className="w-6 h-6 text-green-400" />;
    case "rtf":
      return <BsFileEarmarkRichtext className="w-6 h-6 text-purple-500" />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return <FaFileVideo className="w-6 h-6 text-purple-500" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <FaFileAudio className="w-6 h-6 text-indigo-500" />;
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
      return <FaFileCode className="w-6 h-6 text-teal-500" />;
    default:
      return <AiOutlineFileUnknown className="w-6 h-6 text-gray-500" />;
  }
}

export default function MultipleFileUpload({ label, files, setFiles, className = "col-span-full", endpoint }: MultipleFileUploadProps) {
  function handleImageRemove(fileIndex: number) {
    setFiles(files.filter((_, index) => index !== fileIndex));
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-slate-50 mb-2">
          {label}
        </label>
        {files.length > 0 && (
          <button onClick={() => setFiles([])} type="button" className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 py-2 px-4">
            <Pencil className="w-5 h-5" />
            <span>Change Files</span>
          </button>
        )}
      </div>
      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file, i) => {
            const extension = file.title.split(".").pop();
            return (
              <div key={i} className="relative mb-6">
                <button type="button" onClick={() => handleImageRemove(i)} className="absolute -top-4 -right-2 bg-slate-100 text-red-600 rounded-full">
                  <XCircle className="w-5 h-5" />
                </button>
                <div className="py-2 rounded-md px-6 bg-white dark:bg-slate-800 flex items-center border border-slate-200">
                  {getFileIcon(extension)}
                  <div className="flex flex-col ml-2">
                    <span className="line-clamp-1 text-sm font-medium">{file.title}</span>
                    {file.size > 0 && <span className="text-xs">{(file.size / 1000).toFixed(2)} KB</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <UploadDropzone
          className="ut-allowed-content:hidden"
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            const uploadedFiles = res.map((item) => ({
              url: item.url,
              title: item.name,
              size: item.size,
              type: item.type,
            }));
            setFiles(uploadedFiles);
            toast.success("Upload Completed");
          }}
          onUploadError={(error) => {
            toast.error("File Upload Failed, Try Again");
            console.error("Upload error:", error);
          }}
        />
      )}
    </div>
  );
}