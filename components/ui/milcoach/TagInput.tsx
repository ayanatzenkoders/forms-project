"use client";

import { useState } from "react";

/*
 * Free-text chips (the "Skills Leveraged" field): type a word, press Enter,
 * it becomes a removable chip.
 *
 * CONTROLLED component: it holds no form state of its own beyond the text
 * currently being typed. The parent owns `value` (a string[]) and receives
 * every change through `onChange`, then stores it with setValue().
 * react-hook-form cannot register() this, because chips are not a native input.
 */
interface Props {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
}

export default function TagInput({
  label,
  required,
  placeholder,
  value,
  onChange,
  error,
}: Props) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = draft.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  }

  return (
    <div>
      <label className="mb-1 block text-xs text-slate-600">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Stop Enter from submitting the whole form - we only want to
            // add a chip here.
            e.preventDefault();
            addTag();
          }
        }}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#6DBE45] ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded bg-[#EAF7E3] px-2 py-1 text-xs text-[#4F9E2E]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="text-[#4F9E2E]/60 hover:text-[#4F9E2E]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
