"use client";

import { useState } from "react";
import { uploadJadeFile, deleteJadeFile } from "@/app/actions/jade";

/*
 * One reusable file field. The PARENT owns the value (the stored path string)
 * and decides what to do when a new file is uploaded (onUploaded). This
 * component owns only the mechanics: uploading, the "Uploading…" text, the
 * "✓ Uploaded" state, and replacing (deleting) an old file.
 *
 * This is the "extract a component" idea: the upload behaviour that used to be
 * copy-pasted into Page1/2/3/5 now lives in exactly one place. Fix a bug here,
 * fix it everywhere.
 */
interface Props {
  label: string;
  folder: string; // which Supabase sub-folder, e.g. "resumes"
  accept?: string; // browser hint for the file picker
  hint?: string; // small grey text, e.g. "(JPG, PNG, or PDF)"
  value?: string; // the path already stored for this field (if any)
  error?: string; // validation message from the parent's Zod errors
  onUploaded: (path: string) => void; // parent stores the returned path string
}

export default function FileUpload({
  label,
  folder,
  accept,
  hint = "(JPG, PNG, or PDF)",
  value,
  error,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);

  // The browser will NOT let us pre-fill <input type="file"> after a refresh
  // (a security rule: only a real user click may put a file in that box), so
  // it always reads "No file chosen". We therefore show the stored file's name
  // ourselves, taken from the saved path, as proof it is still uploaded.
  const storedFileName = value ? value.split("/").pop() : null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return; // picker cancelled

    try {
      setUploading(true);

      const fd = new FormData(); // envelope that carries the binary file
      fd.append("file", file);
      fd.append("folder", folder);

      const path = await uploadJadeFile(fd);

      // If this field already had a file, the new upload replaced it in the
      // form — so delete the previous file from storage to avoid an orphan.
      if (value) {
        await deleteJadeFile(value);
      }

      onUploaded(path); // hand the new path back to the parent form
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/*
       * The whole grey box is a <label>. Clicking a label activates its input,
       * so we can visually hide the ugly default "Choose File" button
       * (sr-only) while the entire area stays clickable — and keyboard users
       * can still reach the real input.
       */}
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-lg bg-[#F4F6F8] px-3 py-3 ring-1 transition hover:bg-[#EDF1F5] ${
          error ? "ring-red-400" : "ring-transparent"
        }`}
      >
        {/* round upload icon */}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="min-w-0">
          <span className="block text-xs text-slate-700">
            <span className="font-semibold underline">{label}</span>
            <span className="text-slate-500"> or drag and drop</span>
          </span>
          <span className="block text-[10px] text-slate-400">{hint}</span>
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
        <div className="mt-1 text-xs">
          <p className="text-green-600">✓ Uploaded</p>
          {/* Shows the stored file, since the file box itself always
              says "No file chosen" after a refresh. */}
          <p className="break-all text-slate-500">{storedFileName}</p>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
