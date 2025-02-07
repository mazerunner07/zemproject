import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pen } from "lucide-react";
import { CommentProps } from "@/types/types";
import { createComment, updateCommentById } from "@/actions/comments";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import SubmitButton from "../FormInputs/SubmitButton";
import SunEditorComponent from "../FormInputs/SunEditorComponent";
import { UserRole } from "@prisma/client";

export default function CommentForm({
  projectId,
  userId,
  userName,
  userRole,
  initialContent,
  editingId,
}: {
  projectId: string;
  userId: string;
  initialContent?: string;
  userName: string;
  userRole: UserRole;
  editingId?: string;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentProps>();
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // 👈 Track dialog state

  async function saveComment(data: CommentProps) {
    if (!content?.trim()) {
      toast.error("Please write something.");
      return;
    }

    data.content = content;
    data.userName = userName;
    data.projectId = projectId;
    data.userRole = userRole;
    data.userId = userId;

    try {
      setLoading(true);
      if (editingId) {
        await updateCommentById(editingId, data);
        toast.success("Updated successfully!");
      } else {
        await createComment(data);
        toast.success("Successfully created!");
        reset();
      }

      setIsOpen(false); // 👈 Close dialog after success
    } catch (error) {
      console.error(error);
      toast.error("Error saving comment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {editingId ? (
            <button
              className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              onClick={() => setIsOpen(true)}
            >
              <Pen className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Comment
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(saveComment)}>
            <div className="gap-6 py-8 space-y-3">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Comment" : "Add New Comment"}</DialogTitle>
                <DialogDescription>
                  Please write your comment with respect.
                </DialogDescription>
              </DialogHeader>
              <Card>
                <CardContent>
                  <div className="grid gap-6 mt-4">
                    <SunEditorComponent label="" value={content} onChange={setContent} />
                  </div>
                </CardContent>
              </Card>
              <div className="py-3">
                <SubmitButton title={editingId ? "Update Comment" : "Add Comment"} loading={loading} />
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
