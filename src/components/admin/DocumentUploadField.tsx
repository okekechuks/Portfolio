"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { uploadService } from "@/services/uploadService";

interface DocumentUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "resumes";
  helperText?: string;
  className?: string;
}

function getDisplayName(value: string): string {
  if (typeof window === "undefined") {
    return "Uploaded PDF";
  }

  try {
    const url = new URL(value, window.location.origin);
    const queryName = url.searchParams.get("name");
    if (queryName) return queryName;

    const lastSegment = url.pathname.split("/").filter(Boolean).pop();
    if (lastSegment) return lastSegment;
  } catch {
    // Fall back to a generic label below.
  }

  return "Uploaded PDF";
}

export function DocumentUploadField({
  label,
  value,
  onChange,
  folder,
  helperText = "Upload a PDF resume. It will be saved and exposed as a download link.",
  className,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const url = await uploadService.uploadDocument({ file, folder });
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

      <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <FileText size={22} />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-zinc-200">
            {value ? getDisplayName(value) : "No PDF selected"}
          </p>
          <p className="text-xs leading-relaxed text-zinc-500">{helperText}</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
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
            {value ? "Replace PDF" : "Upload PDF"}
          </Button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
