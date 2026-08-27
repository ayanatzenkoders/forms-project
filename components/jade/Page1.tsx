"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form1Schema, Form1Values } from "./schemas";
import { getJadeCategories, createJadeCategory } from "@/app/actions/jade";
import FileUpload from "./FileUpload";
import FormShell from "@/components/ui/FormShell";
import FormActions from "@/components/ui/FormActions";
import SectionLabel from "@/components/ui/SectionLabel";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";
import TextAreaField from "@/components/ui/TextAreaField";

interface Props {
  nextPage: () => void;
  updateSection: UpdateSection;
  formData: JadeFormData;
}

interface Category {
  id: string;
  category_type: string;
  name: string;
}

export default function JadePage1({
  nextPage,
  updateSection,
  formData,
}: Props) {
  const [hobbies, setHobbies] = useState<Category[]>([]);
  const [loadingHobbies, setLoadingHobbies] = useState(true);
  const [newHobby, setNewHobby] = useState("");
  const [addingHobby, setAddingHobby] = useState(false);
  // Toggles the little "type a new hobby" row opened by the + button.
  const [showAddHobby, setShowAddHobby] = useState(false);

  useEffect(() => {
    async function loadHobbies() {
      try {
        const data = await getJadeCategories();
        setHobbies(data);
      } catch (error) {
        console.error("ERROR loading hobbies:", error);
      } finally {
        setLoadingHobbies(false);
      }
    }

    loadHobbies();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<Form1Values>({
    resolver: zodResolver(form1Schema),
    mode: "onBlur",
    // The layout's JadeGate waits for hydration before this page mounts, so
    // formData is already the saved draft here. That means defaultValues is
    // reliable on first render and the old reset() effect is no longer needed.
    defaultValues: {
      hobbies: [],
      ...formData.personalInformation,
    },
  });

  // The currently chosen hobbies. watch() re-renders this component whenever
  // the field changes, which is how the chips below stay in sync.
  const selectedHobbies = watch("hobbies") ?? [];

  function addHobby(name: string) {
    if (!name || selectedHobbies.includes(name)) return;
    setValue("hobbies", [...selectedHobbies, name], { shouldValidate: true });
  }

  function removeHobby(name: string) {
    setValue(
      "hobbies",
      selectedHobbies.filter((h) => h !== name),
      { shouldValidate: true },
    );
  }

  // Creates a brand-new hobby category in the database, then selects it.
  async function handleAddHobby() {
    if (!newHobby.trim()) return;

    try {
      setAddingHobby(true);

      const newCategory = await createJadeCategory(newHobby.trim());

      setHobbies((prev) => [...prev, newCategory]);
      addHobby(newCategory.name);

      setNewHobby("");
      setShowAddHobby(false);
    } catch (error) {
      console.error("Failed to add hobby:", error);
    } finally {
      setAddingHobby(false);
    }
  }

  // Called by <FileUpload> after a successful upload. We (1) store the returned
  // path string in the form, and (2) immediately persist the whole section to
  // localStorage — so if the user refreshes mid-page, the uploaded file's path
  // isn't lost (it would otherwise only be saved on "Next").
  function handleUploaded(
    field: "profileImagePath" | "resumePath",
    path: string,
  ) {
    setValue(field, path, { shouldValidate: true });
    updateSection("personalInformation", getValues());
  }

  const onSubmit = (data: Form1Values) => {
    updateSection("personalInformation", data);
    nextPage();
  };

  return (
    <FormShell
      onSubmit={handleSubmit(onSubmit)}
      title="Personal Information"
      actions={<FormActions nextLabel="Next" />}
    >
      <SectionLabel>Basic information</SectionLabel>

      <FileUpload
        label="Upload Your Profile"
        folder="profile-images"
        accept="image/*"
        hint="(JPG, PNG, or PDF)"
        value={watch("profileImagePath")}
        error={errors.profileImagePath?.message}
        onUploaded={(path) => handleUploaded("profileImagePath", path)}
      />

      {/* Age + Gender share one row, as in the design */}
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Age"
          type="number"
          step="1"
          error={errors.age?.message}
          {...register("age", { valueAsNumber: true })}
        />

        <SelectField
          label="Gender"
          error={errors.gender?.message}
          {...register("gender")}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </SelectField>
      </div>

      <TextField
        label="Religion"
        error={errors.religion?.message}
        {...register("religion")}
      />

      <TextField
        label="Race"
        error={errors.race?.message}
        {...register("race")}
      />

      <FileUpload
        label="Upload Your Resume"
        folder="resumes"
        accept=".pdf,.doc,.docx"
        hint="(JPG, PNG, or PDF)"
        value={watch("resumePath")}
        error={errors.resumePath?.message}
        onUploaded={(path) => handleUploaded("resumePath", path)}
      />

      <TextField
        label="Years Of Experience"
        type="number"
        step="any"
        error={errors.yearsExperience?.message}
        {...register("yearsExperience", { valueAsNumber: true })}
      />

      <TextAreaField
        label="Favourite Quote"
        error={errors.favouriteQuote?.message}
        {...register("favouriteQuote")}
      />

      {/* ---------- Hobbies: pick from the list, or add a new one ---------- */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SelectField
              label="Hobbies"
              value=""
              disabled={loadingHobbies}
              error={errors.hobbies?.message}
              // Not registered with RHF: this dropdown is only a picker.
              // Choosing an option pushes it into the real `hobbies` array.
              onChange={(e) => addHobby(e.target.value)}
            >
              <option value="">
                {loadingHobbies ? "Loading…" : "Select a hobby"}
              </option>
              {hobbies
                .filter((h) => !selectedHobbies.includes(h.name))
                .map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
            </SelectField>
          </div>

          <button
            type="button"
            onClick={() => setShowAddHobby((v) => !v)}
            aria-label="Add a new hobby"
            className="h-10 w-10 shrink-0 rounded-lg bg-[#F4F6F8] text-lg text-slate-600 transition hover:bg-[#EDF1F5]"
          >
            +
          </button>
        </div>

        {showAddHobby && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Enter new hobby"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              className="flex-1 rounded-lg bg-[#F4F6F8] px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleAddHobby}
              disabled={addingHobby}
              className="rounded-lg bg-[#0B2B5B] px-4 text-sm text-white disabled:opacity-50"
            >
              {addingHobby ? "Adding…" : "Add"}
            </button>
          </div>
        )}

        {/* Selected hobbies as removable chips */}
        {selectedHobbies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedHobbies.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-md bg-[#E8F5FD] px-2 py-1 text-xs text-[#1B75BC]"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeHobby(name)}
                  aria-label={`Remove ${name}`}
                  className="text-[#1B75BC]/70 hover:text-[#1B75BC]"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Address ---------- */}
      <SectionLabel>Address Details</SectionLabel>

      <TextField
        label="Country"
        error={errors.country?.message}
        {...register("country")}
      />

      <TextField
        label="State"
        error={errors.state?.message}
        {...register("state")}
      />

      <TextAreaField
        label="Address"
        error={errors.address?.message}
        {...register("address")}
      />
    </FormShell>
  );
}
