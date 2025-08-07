"use client";

import { IconFile, IconPdf } from "@xefi/x-react/icons";
import Image from "next/image";
import React, { useState } from "react";

import { FilePreviewProps } from "../_types";

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [file, preview]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return (
        <svg
          className="size-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (fileType.includes("pdf")) {
      return <IconPdf />;
    }
    return <IconFile />;
  };

  return (
    <div className="group relative flex items-center gap-3 rounded-lg border  border-border/40 bg-content1-100/60 p-3 transition-all duration-200 hover:bg-content1-100/80">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-white">
        {preview ? (
          <Image
            src={preview}
            alt={file.name}
            width={48}
            height={48}
            className="size-full rounded-lg object-cover"
          />
        ) : (
          getFileIcon(file.type)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {file.name}
        </p>
        <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full bg-danger/10 p-1.5 text-danger opacity-60 transition-all duration-200 hover:bg-danger/20 focus:outline-none focus:ring-2 focus:ring-danger/20 group-hover:opacity-100"
        aria-label="Supprimer le fichier"
      >
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
