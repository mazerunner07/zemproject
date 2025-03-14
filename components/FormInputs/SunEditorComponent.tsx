"use client";

import React, { useEffect, useRef } from "react";
import SunEditor from "suneditor";
import "suneditor/dist/css/suneditor.min.css";

interface SunEditorComponentProps {
  label: string;
  className?: string;
  value: string;
  onChange: (content: string) => void;
}

export default function SunEditorComponent({
  label,
  className = "sm:col-span-2 w-full",
  value,
  onChange,
}: SunEditorComponentProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const sunEditorInstance = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && !sunEditorInstance.current) {
      sunEditorInstance.current = SunEditor.create(editorRef.current, {
        height: "200px",
        buttonList: [
          ["bold", "italic", "underline", "strike"],
          ["undo", "redo"],
          ["removeFormat"],
        ],
        defaultTag: "div",
        defaultStyle: "font-size: 20px;", // Set default text size to large
      });

      sunEditorInstance.current.setContents(value);
      sunEditorInstance.current.onChange = (content: string) => {
        onChange(content);
      };
    }
  }, [value, onChange]);

  return (
    <div className={className}>
      <label className="block text-sm  font-medium text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      <div ref={editorRef} className=" border rounded-md p-2 w-full min-h-[200px]" />
    </div>
  );
}
