import { getAuthUser } from "@/config/useAuth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  projectImage: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "JB" };
    }
  ),
  clientProfileImage: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "JB" };
    }
  ),
  projectThumbnail: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "JB" };
    }
  ),
  imageUploader: f({ image: { maxFileSize: "4MB" } })
  .middleware(async ({ req }) => {
    const user = await getAuthUser();
    if (!user) throw new Error(`Cant find user from req: ${req.toString()}`); // client onError will get "Failed to run middleware"
    if (!user.id) throw new UploadThingError("No user ID"); // client onError will get "No user ID"
    return { userId: user.id };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId);
    console.log("file url", file.url);
    return { uploadedBy: metadata.userId };
  }),
  projectBanner: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "JB" };
    }
  ),
  fileUploads: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "JB" };
  }),
  mailAttachments: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "JB" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
