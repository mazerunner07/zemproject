"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";

interface TipTapEditorProps {
  label: string;
  className?: string;
  value: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({
  label,
  className = "sm:col-span-2",
  value,
  onChange,
}: TipTapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      {mounted && editor ? (
        <div className=" rounded-md p-2 min-h-[200px]">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div className="border rounded-md p-2 min-h-[200px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          Loading editor...
        </div>
      )}
    </div>
  );
}
