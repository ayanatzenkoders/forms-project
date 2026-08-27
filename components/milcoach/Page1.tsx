"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MilCoachFormData, UpdateMilCoachSection } from "./types";
import {
  page1Schema,
  Page1Values,
  BRANCHES,
  LANGUAGES,
  RANKS,
} from "./schemas";
import MilCoachShell from "@/components/ui/milcoach/MilCoachShell";
import TextField from "@/components/ui/milcoach/TextField";
import SelectField from "@/components/ui/milcoach/SelectField";
import MultiSelect from "@/components/ui/milcoach/MultiSelect";
import ResumeUpload from "@/components/ui/milcoach/ResumeUpload";

interface Props {
  nextPage: () => void;
  updateSection: UpdateMilCoachSection;
  formData: MilCoachFormData;
}

export default function Page1({ nextPage, updateSection, formData }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Page1Values>({
    resolver: zodResolver(page1Schema),
    defaultValues: {
      languages: [], // array fields must never start undefined
      ...formData.personalDetails,
    },
  });

  // watch() re-renders this component when the value changes, which is how the
  // language chips and the "uploaded" state stay in sync.
  const languages = watch("languages") ?? [];

  // Persist the resume path immediately, so a mid-page refresh doesn't lose it
  // (it would otherwise only be saved when Next is pressed).
  function handleUploaded(path: string) {
    setValue("resumePath", path, { shouldValidate: true });
    updateSection("personalDetails", getValues());
  }

  const onSubmit = (data: Page1Values) => {
    updateSection("personalDetails", data);
    nextPage();
  };

  return (
    <MilCoachShell step={1} onSubmit={handleSubmit(onSubmit)}>
      <section className="rounded-lg">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Basic Information
        </h2>

        <ResumeUpload
          value={watch("resumePath")}
          error={errors.resumePath?.message}
          onUploaded={handleUploaded}
        />

        <p className="mt-6 text-sm text-slate-700">
          Or Complete Your Profile{" "}
          <span className="font-medium text-[#6DBE45]">Manually</span>
        </p>

        {/* Row 1: Name, Age, Branch of Service */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            label="Name"
            required
            placeholder="Enter Name"
            error={errors.name?.message}
            {...register("name")}
          />

          <TextField
            label="Age (optional)"
            placeholder="Enter Age"
            error={errors.age?.message}
            {...register("age")}
          />

          <SelectField
            label="Branch of Service"
            required
            error={errors.branchOfService?.message}
            {...register("branchOfService")}
          >
            <option value="">Select</option>
            {BRANCHES.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Row 2: Languages, Rank */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MultiSelect
            label="Languages"
            required
            placeholder="Language"
            options={LANGUAGES}
            value={languages}
            // Not registered: chips are not a native input, so we write the
            // value ourselves with setValue().
            onChange={(next) =>
              setValue("languages", next, { shouldValidate: true })
            }
            error={errors.languages?.message}
          />

          <SelectField
            label="Rank"
            required
            error={errors.rank?.message}
            {...register("rank")}
          >
            <option value="">Select</option>
            {RANKS.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </SelectField>
        </div>
      </section>
    </MilCoachShell>
  );
}
