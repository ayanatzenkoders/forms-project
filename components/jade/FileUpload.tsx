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
  value?: string; // the path already stored for this field (if any)
  error?: string; // validation message from the parent's Zod errors
  onUploaded: (path: string) => void; // parent stores the returned path string
}

export default function FileUpload({
  label,
  folder,
  accept,
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
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="file" accept={accept} onChange={handleChange} />

      {uploading && <p className="text-xs">Uploading…</p>}

      {value && !uploading && (
        <div className="text-xs mt-1">
          <p className="text-green-600">✓ Uploaded</p>
          {/* Shows the stored file, since the file box itself always
              says "No file chosen" after a refresh. */}
          <p className="text-gray-500 break-all">{storedFileName}</p>
          <p className="text-gray-400">
            Choose a file again to replace it.
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
