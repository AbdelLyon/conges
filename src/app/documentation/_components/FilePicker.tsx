"use client";

import React, { useCallback, useRef, useState } from "react";
import { IconUpload } from "x-react/icons";

import { FilePickerProps } from "../_types";

import { FilePreview } from "./FilePreview";

export const FilePicker: React.FC<FilePickerProps> = ({
  onFilesChange,
  error,
  value = [],
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes =
    "application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx";
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFiles = (files: File[]) => {
    setUploadError(null);
    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize) {
        setUploadError(
          `Le fichier ${file.name} est trop volumineux (max 10MB)`,
        );
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesChange?.(validFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onFilesChange?.(newFiles);
  };

  const currentError = error || uploadError;

  return (
    <div className="space-y-4">
      {/* Zone de drop minimaliste */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
        onClick={() => inputRef.current?.click()}
        className={`
          cursor-pointer rounded-lg border-2 border-dashed border-outline/20 p-16 text-center opacity-50 transition-colors hover:bg-outline/5
          ${isDragActive ? "border-blue-400 bg-blue-50" : " hover:opacity-100"}
          ${!!error ? "border-danger dark:border-danger" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Icône simple */}
        <IconUpload className="mb-4 w-full text-center opacity-30" size={40} />

        {/* Texte */}
        <p className="mb-2 text-gray-600">
          Glissez une image ou{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Parcourir
          </button>
        </p>

        {/* Informations */}
        <p className="text-sm text-gray-500">
          Formats acceptés: PDF, DOC, DOCX
        </p>
        <p className="text-sm text-gray-500">Taille max: 10MB</p>
      </div>

      {/* Erreur */}
      {currentError && <p className="text-sm text-red-600">{currentError}</p>}

      {/* Fichiers sélectionnés */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
