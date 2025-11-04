"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { ImageSquare as ImageIcon } from "@phosphor-icons/react";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onUpload: (file: File) => void;
  error?: string | null;
  className?: string;
}

export function UploadArea({ onUpload, error, className }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);

  const validateFile = React.useCallback((file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not supported. Please use: ${ALLOWED_IMAGE_TYPES.join(", ")}`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  }, []);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validationError = validateFile(file);
        if (validationError) {
          return;
        }
        onUpload(file);
      }
    },
    [validateFile, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ALLOWED_IMAGE_TYPES.map((type) => type.split("/")[1]),
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const active = isDragActive || dropzoneActive;

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Upload Image</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to upload an image
          </p>
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-12 md:p-16",
            "cursor-pointer transition-all duration-200",
            "flex flex-col items-center justify-center",
            "min-h-[280px]",
            active
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            error && "border-destructive"
          )}
        >
          <input {...getInputProps()} />
          
          <div
            className={cn(
              "mb-6 transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ImageIcon size={56} weight="duotone" />
          </div>

          {active ? (
            <p className="text-base font-medium text-primary">Drop the image here...</p>
          ) : (
            <div className="space-y-2 text-center">
              <p className="text-base font-medium">
                Drag & drop an image here
              </p>
              <p className="text-sm text-muted-foreground">
                or tap to browse • PNG, JPG, WEBP up to {MAX_IMAGE_SIZE / 1024 / 1024}MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

