"use client";

import { useState } from "react";
import {
  uploadPractitionerFile,
  deletePractitionerFile,
} from "@/app/actions/practitioner";

/*
 * The dashed "Click to upload or drag and drop" area.
 *
 * Same upload-on-select design as the Jade form: the file goes to Supabase the
 * moment it is chosen and only the returned PATH STRING is kept in form state,
 * because strings survive localStorage / JSON / refresh and Files do not.
 *
 * The whole dashed area is a <label> wrapping a visually hidden file input, so
 * clicking anywhere opens the picker while keyboard users can still tab to it.
 */
interface Props {
  folder: string;
  accept?: string;
  hint?: string;
  value?: string; // path already stored, if any
  error?: string;
  onUploaded: (path: string) => void;
}

export default function UploadBox({
  folder,
  accept,
  hint = "(SVG, JPG, PNG, or PDF maximum 900x400)",
  value,
  error,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);

  // A file input can never be pre-filled after a refresh (browser security),
  // so we show the stored file name ourselves as proof it is still uploaded.
  const storedFileName = value ? value.split("/").pop() : null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const fd = new FormData(); // envelope that can carry the binary file
      fd.append("file", file);
      fd.append("folder", folder);

      const path = await uploadPractitionerFile(fd);

      // Replacing an existing file? Delete the old one so it isn't orphaned.
      if (value) await deletePractitionerFile(value);

      onUploaded(path);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed bg-white px-4 py-8 transition hover:bg-slate-50 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="text-center">
          <span className="block text-sm font-medium text-slate-700">
            Click to upload{" "}
            <span className="font-normal text-slate-500">or drag and drop</span>
          </span>
          <span className="block text-xs text-slate-400">{hint}</span>
        </span>

        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
      {value && !uploading && (
        <p className="mt-1 text-xs text-green-600">✓ Uploaded — {storedFileName}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
