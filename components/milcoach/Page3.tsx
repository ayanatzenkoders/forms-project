"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MilCoachFormData, UpdateMilCoachSection } from "./types";
import {
  page3Schema,
  Page3Values,
  EducationValues,
  educationSchema,
  EDUCATION_LEVELS,
} from "./schemas";
import { submitMilCoachForm } from "@/app/actions/milcoach";
import MilCoachShell from "@/components/ui/milcoach/MilCoachShell";
import TextField from "@/components/ui/milcoach/TextField";
import SelectField from "@/components/ui/milcoach/SelectField";
import EntryTable from "@/components/ui/milcoach/EntryTable";

interface Props {
  prevPage: () => void;
  onSuccess: () => void;
  updateSection: UpdateMilCoachSection;
  formData: MilCoachFormData;
}

const emptyEducation: EducationValues = {
  level: "",
  institution: "",
  fieldOfStudy: "",
  associates: "",
};

export default function Page3({
  prevPage,
  onSuccess,
  updateSection,
  formData,
}: Props) {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
  } = useForm<Page3Values>({
    resolver: zodResolver(page3Schema),
    defaultValues: {
      educations: [],
      certificates: [],
      ...formData.education,
    },
  });

  // Two independent lists on this page, so two useFieldArray calls.
  const educationList = useFieldArray({ control, name: "educations" });
  const certificateList = useFieldArray({ control, name: "certificates" });

  // Scratch pads: values being typed before they are added to a list.
  const [eduDraft, setEduDraft] = useState<EducationValues>(emptyEducation);
  const [eduEditing, setEduEditing] = useState<number | null>(null);
  // Per-field messages for the scratch pad, keyed by field name.
  const [eduErrors, setEduErrors] = useState<Record<string, string>>({});

  const [certDraft, setCertDraft] = useState("");
  const [certEditing, setCertEditing] = useState<number | null>(null);

  function handleAddEducation() {
    // Validate the scratch pad with the SAME schema the submit uses, so there
    // is only one definition of a valid education entry.
    const result = educationSchema.safeParse(eduDraft);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setEduErrors(fieldErrors);
      return;
    }

    setEduErrors({});

    if (eduEditing === null) {
      educationList.append(eduDraft);
    } else {
      educationList.update(eduEditing, eduDraft);
      setEduEditing(null);
    }

    setEduDraft(emptyEducation);
  }

  function handleAddCertificate() {
    if (!certDraft.trim()) return;

    if (certEditing === null) {
      certificateList.append({ name: certDraft.trim() });
    } else {
      certificateList.update(certEditing, { name: certDraft.trim() });
      setCertEditing(null);
    }

    setCertDraft("");
  }

  // The last step, so this SUBMITS the whole form rather than navigating on.
  const onSubmit = async (data: Page3Values) => {
    try {
      // Latest step-3 values plus everything already saved in context.
      const completeData = { ...formData, education: data };

      // Only path strings and plain values here, so this is ordinary JSON -
      // no FormData envelope needed.
      const result = await submitMilCoachForm(completeData);

      if (result.success) {
        alert("MilCoach profile submitted successfully!");

        localStorage.removeItem("MilCoachFormData");

        // Navigating away unmounts the provider, which discards the in-memory
        // draft for free. We deliberately do not clearForm() while still on
        // this page - that would re-render it mid-navigation.
        onSuccess();
      }
    } catch (error) {
      console.error("MilCoach submission failed:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  async function handleSkip() {
    updateSection("education", getValues());
    await onSubmit(getValues());
  }

  return (
    <MilCoachShell
      step={3}
      onSubmit={handleSubmit(onSubmit)}
      onPrevious={prevPage}
      onSkip={handleSkip}
      nextLabel="Submit"
      isSubmitting={isSubmitting}
    >
      {/* ---------------- Education ---------------- */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Education</h2>
          <button
            type="button"
            onClick={handleAddEducation}
            className="rounded-md bg-[#6DBE45] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#5CA838]"
          >
            + {eduEditing === null ? "Add" : "Update"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SelectField
            label="Level of Education"
            required
            error={eduErrors.level}
            value={eduDraft.level}
            onChange={(e) => setEduDraft({ ...eduDraft, level: e.target.value })}
          >
            <option value="">Select</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectField>

          <TextField
            label="Name of Institution"
            required
            placeholder="Enter Name"
            error={eduErrors.institution}
            value={eduDraft.institution}
            onChange={(e) =>
              setEduDraft({ ...eduDraft, institution: e.target.value })
            }
          />

          <TextField
            label="Field of Study"
            required
            placeholder="For Example, Mathematics"
            error={eduErrors.fieldOfStudy}
            value={eduDraft.fieldOfStudy}
            onChange={(e) =>
              setEduDraft({ ...eduDraft, fieldOfStudy: e.target.value })
            }
          />
        </div>

        <div className="mt-4 md:w-1/3">
          <SelectField
            label="Associates"
            required
            error={eduErrors.associates}
            value={eduDraft.associates}
            onChange={(e) =>
              setEduDraft({ ...eduDraft, associates: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </SelectField>
        </div>

        <div className="mt-5">
          <EntryTable
            title="Education"
            columns={[
              "Level of Education",
              "Name of Institution",
              "Degree and Field of study",
            ]}
            rows={educationList.fields.map((field) => {
              const row = field as unknown as EducationValues;
              return [row.level, row.institution, row.fieldOfStudy];
            })}
            onEdit={(index) => {
              setEduDraft(
                educationList.fields[index] as unknown as EducationValues,
              );
              setEduEditing(index);
            }}
            onDelete={educationList.remove}
          />
        </div>
      </section>

      {/* ---------------- Certificates ---------------- */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Certificates
        </h2>

        <div className="flex items-end gap-3">
          <div className="md:w-1/3">
            <TextField
              label="Certificate"
              required
              placeholder="Enter Name"
              value={certDraft}
              onChange={(e) => setCertDraft(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleAddCertificate}
            className="mb-0.5 rounded-md bg-[#6DBE45] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#5CA838]"
          >
            + {certEditing === null ? "Add" : "Update"}
          </button>
        </div>

        <div className="mt-5">
          <EntryTable
            title="Certificate"
            columns={["Certificate", "Name"]}
            rows={certificateList.fields.map((field, index) => {
              const row = field as unknown as { name: string };
              return [`Certificate ${index + 1}`, row.name];
            })}
            onEdit={(index) => {
              const row = certificateList.fields[index] as unknown as {
                name: string;
              };
              setCertDraft(row.name);
              setCertEditing(index);
            }}
            onDelete={certificateList.remove}
          />
        </div>
      </section>
    </MilCoachShell>
  );
}
