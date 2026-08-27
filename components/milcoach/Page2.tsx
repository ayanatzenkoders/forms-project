"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MilCoachFormData, UpdateMilCoachSection } from "./types";
import {
  page2Schema,
  Page2Values,
  ExperienceValues,
  experienceSchema,
  POSITION_LEVELS,
} from "./schemas";
import MilCoachShell from "@/components/ui/milcoach/MilCoachShell";
import TextField from "@/components/ui/milcoach/TextField";
import SelectField from "@/components/ui/milcoach/SelectField";
import TagInput from "@/components/ui/milcoach/TagInput";
import EntryTable from "@/components/ui/milcoach/EntryTable";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  updateSection: UpdateMilCoachSection;
  formData: MilCoachFormData;
}

// What the "add an entry" mini-form starts as.
const emptyDraft: ExperienceValues = {
  careerField: "",
  jobTitle: "",
  years: "",
  skills: [],
};

export default function Page2({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<Page2Values>({
    resolver: zodResolver(page2Schema),
    defaultValues: {
      experiences: [],
      industryOfInterest: "",
      jobPositionOfInterest: "",
      jobPositionLevel: "",
      location: "",
      ...formData.workExperience,
    },
  });

  /*
   * useFieldArray manages a LIST field for us. `control` is the link back to
   * this form instance; `name` says which field holds the list.
   *   fields - the current rows (each with an `id` React can use as a key)
   *   append - add a row     remove - delete a row     update - replace one
   */
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "experiences",
  });

  /*
   * The inputs at the top are NOT part of the form data - they are a scratch
   * pad for building one entry. That is why they live in plain useState and
   * only reach the form when "+ Add" is pressed.
   */
  const [draft, setDraft] = useState<ExperienceValues>(emptyDraft);
  // null = adding a new row; a number = editing that existing row.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Per-field messages for the scratch pad, keyed by field name.
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});

  function handleAdd() {
    /*
     * Validate the scratch pad with the SAME schema the submit uses.
     * Previously this was a hand-written "is it empty" check, so `years: "abc"`
     * sailed through - the row was appended and nothing ever complained.
     * Reusing experienceSchema means one definition of "valid entry".
     */
    const result = experienceSchema.safeParse(draft);

    if (!result.success) {
      // Turn Zod's issue list into {fieldName: message} for the inputs.
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setDraftErrors(fieldErrors);
      return;
    }

    setDraftErrors({});

    if (editingIndex === null) {
      append(draft); // new row
    } else {
      update(editingIndex, draft); // save the row being edited
      setEditingIndex(null);
    }

    setDraft(emptyDraft); // clear the scratch pad
  }

  function handleEdit(index: number) {
    // Load the row back into the scratch pad; "Add" turns into "Update".
    setDraft(fields[index] as unknown as ExperienceValues);
    setEditingIndex(index);
  }

  const onSubmit = (data: Page2Values) => {
    updateSection("workExperience", data);
    nextPage();
  };

  // Skipping still saves whatever has been entered so far.
  function handleSkip() {
    updateSection("workExperience", getValues());
    nextPage();
  }

  return (
    <MilCoachShell
      step={2}
      onSubmit={handleSubmit(onSubmit)}
      onPrevious={prevPage}
      onSkip={handleSkip}
    >
      {/* ---------------- Work Experience ---------------- */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Work Experience
          </h2>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-[#6DBE45] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#5CA838]"
          >
            + {editingIndex === null ? "Add" : "Update"}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextField
              label="Career Field"
              required
              placeholder="Enter Career"
              error={draftErrors.careerField}
              value={draft.careerField}
              onChange={(e) =>
                setDraft({ ...draft, careerField: e.target.value })
              }
            />
            <TextField
              label="Job Title/Position"
              required
              placeholder="Enter Job Title"
              error={draftErrors.jobTitle}
              value={draft.jobTitle}
              onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
            />
            <TextField
              label="Years In Career Field"
              required
              placeholder="Enter Years"
              error={draftErrors.years}
              value={draft.years}
              onChange={(e) => setDraft({ ...draft, years: e.target.value })}
            />
          </div>

          <div className="mt-4 md:w-1/3">
            <TagInput
              label="Skills Leveraged in Career Field"
              required
              placeholder="Skills"
              value={draft.skills}
              onChange={(skills) => setDraft({ ...draft, skills })}
            />
          </div>

          <div className="mt-5">
            <EntryTable
              title="Work Experience"
              columns={["Career", "Job Position", "Years", "Skills"]}
              rows={fields.map((field) => {
                const row = field as unknown as ExperienceValues;
                return [
                  row.careerField,
                  row.jobTitle,
                  row.years,
                  <span key="skills" className="flex flex-wrap gap-1">
                    {row.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-[#EAF7E3] px-1.5 py-0.5 text-[10px] text-[#4F9E2E]"
                      >
                        {skill}
                      </span>
                    ))}
                  </span>,
                ];
              })}
              onEdit={handleEdit}
              onDelete={remove}
            />
          </div>
        </div>
      </section>

      {/* ---------------- Career Aspirations ---------------- */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Career Aspirations
        </h2>
        <p className="mb-4 text-xs text-[#6DBE45]">
          If you are not sure what you want to do, you can leave this blank
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            label="Industry of Interest"
            placeholder="Enter industry of interest"
            error={errors.industryOfInterest?.message}
            {...register("industryOfInterest")}
          />
          <TextField
            label="Job Position of Interest"
            placeholder="Enter Job Position"
            error={errors.jobPositionOfInterest?.message}
            {...register("jobPositionOfInterest")}
          />
          <SelectField
            label="Job Position Level"
            error={errors.jobPositionLevel?.message}
            {...register("jobPositionLevel")}
          >
            <option value="">Choose Position Level</option>
            {POSITION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 md:w-1/3">
          <TextField
            label="Location"
            placeholder="Ex. Boston, MA"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>
      </section>
    </MilCoachShell>
  );
}
