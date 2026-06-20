"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { uploadService } from "@/services/uploadService";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "profile" | "projects";
  previewAlt: string;
  fallbackSrc: string;
  helperText?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  previewAlt,
  fallbackSrc,
  helperText = "Upload an image file. It will be saved automatically.",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const previewSrc = value || fallbackSrc;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const url = await uploadService.uploadImage({ file, folder });
      onChange(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
          >
            <X size={14} />
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70">
          <img
            src={previewSrc}
            alt={previewAlt}
            className="h-full w-full object-cover"
            onError={(event) => {
              if (event.currentTarget.src.endsWith(fallbackSrc)) return;
              event.currentTarget.src = fallbackSrc;
            }}
          />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-xs leading-relaxed text-zinc-500">{helperText}</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            isLoading={isUploading}
          >
            <Upload size={16} />
            {value ? "Replace Image" : "Upload Image"}
          </Button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
