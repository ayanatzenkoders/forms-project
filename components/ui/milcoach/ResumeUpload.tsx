"use client";

import { useState } from "react";
import { uploadMilCoachFile, deleteMilCoachFile } from "@/app/actions/milcoach";

/*
 * The big dashed "Upload or drag and drop" panel with a button inside.
 * Uploads on select and reports back the stored PATH STRING.
 */
interface Props {
  value?: string;
  error?: string;
  onUploaded: (path: string) => void;
}

export default function ResumeUpload({ value, error, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  // A file input cannot be pre-filled after a refresh (browser security), so we
  // show the stored name ourselves as proof the file is still there.
  const storedFileName = value ? value.split("/").pop() : null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fd = new FormData(); // envelope that carries the binary file
      fd.append("file", file);
      fd.append("folder", "resumes");

      const path = await uploadMilCoachFile(fd);

      if (value) await deleteMilCoachFile(value); // replace -> no orphan

      onUploaded(path);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm text-slate-700">Upload a Resume</p>

      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-[#FAFAFA] px-4 py-12 text-center transition hover:bg-slate-50 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        <span className="text-xs text-slate-400">Upload or drag and drop</span>
        <span className="text-[11px] text-slate-400">
          PDF (Preferred), DOCX, DOC, RTF, TXT up to 5MB
        </span>

        <span className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
          ⬆ {uploading ? "Uploading…" : "Upload a Resume"}
        </span>

        <input
          type="file"
          accept=".pdf,.docx,.doc,.rtf,.txt"
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {value && !uploading && (
        <p className="mt-1 text-xs text-green-600">✓ Uploaded — {storedFileName}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
