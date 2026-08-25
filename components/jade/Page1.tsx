"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JadeFormData, UpdateSection } from "./types";
import { form1Schema, Form1Values } from "./schemas";
import { getJadeCategories, createJadeCategory } from "@/app/actions/jade";
import FileUpload from "./FileUpload";

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

  async function handleAddHobby() {
    if (!newHobby.trim()) return;

    try {
      setAddingHobby(true);

      const newCategory = await createJadeCategory(newHobby.trim());

      setHobbies((prev) => [...prev, newCategory]);

      setNewHobby("");
    } catch (error) {
      console.error("Failed to add hobby:", error);
    } finally {
      setAddingHobby(false);
    }
  }

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto p-4"
    >
      <h2>Personal Information</h2>

      {/* Profile Image Upload */}
      <FileUpload
        label="Profile Image"
        folder="profile-images"
        accept="image/*"
        value={watch("profileImagePath")}
        error={errors.profileImagePath?.message}
        onUploaded={(path) => handleUploaded("profileImagePath", path)}
      />

      {/* Age */}
      <div>
        <label className="block text-sm font-medium">Age</label>
        <input
          type="number"
          step="1"
          {...register("age", { valueAsNumber: true })}
          className="border p-2 w-full"
        />
        {errors.age && (
          <p className="text-red-500 text-xs">{errors.age.message}</p>
        )}
      </div>

      {/* Gender Dropdown */}
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select {...register("gender")} className="border p-2 w-full">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs">{errors.gender.message}</p>
        )}
      </div>

      {/* Religion */}
      <div>
        <label className="block text-sm font-medium">Religion</label>
        <input
          type="text"
          {...register("religion")}
          className="border p-2 w-full"
        />
        {errors.religion && (
          <p className="text-red-500 text-xs">{errors.religion.message}</p>
        )}
      </div>

      {/* Race */}
      <div>
        <label className="block text-sm font-medium">Race</label>
        <input
          type="text"
          {...register("race")}
          className="border p-2 w-full"
        />
        {errors.race && (
          <p className="text-red-500 text-xs">{errors.race.message}</p>
        )}
      </div>

      {/* Resume Upload */}
      <FileUpload
        label="Upload Resume"
        folder="resumes"
        accept=".pdf,.doc,.docx"
        value={watch("resumePath")}
        error={errors.resumePath?.message}
        onUploaded={(path) => handleUploaded("resumePath", path)}
      />

      {/* Years of Experience */}
      <div>
        <label className="block text-sm font-medium">Years of Experience</label>
        <input
          type="number"
          step="any"
          {...register("yearsExperience", { valueAsNumber: true })}
          className="border p-2 w-full"
        />
        {errors.yearsExperience && (
          <p className="text-red-500 text-xs">
            {errors.yearsExperience.message}
          </p>
        )}
      </div>

      {/* Favorite Quote */}
      <div>
        <label className="block text-sm font-medium">Favourite Quote</label>
        <textarea
          {...register("favouriteQuote")}
          className="border p-2 w-full"
        />
        {errors.favouriteQuote && (
          <p className="text-red-500 text-xs">
            {errors.favouriteQuote.message}
          </p>
        )}
      </div>

      {/* Hobbies */}
      <div>
        <label className="block text-sm font-medium">Hobbies</label>

        {/* Existing hobbies from Supabase */}
        {loadingHobbies && (
          <p className="text-xs text-gray-400 mt-2">Loading hobbies…</p>
        )}
        <div className="flex flex-wrap gap-4 mt-2">
          {hobbies.map((hobby) => (
            <label key={hobby.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={hobby.name}
                {...register("hobbies")}
              />

              {hobby.name}
            </label>
          ))}
        </div>

        {errors.hobbies && (
          <p className="text-red-500 text-xs">{errors.hobbies.message}</p>
        )}

        {/* Add New Hobby */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Enter new hobby"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            className="border p-2 flex-1"
          />

          <button
            type="button"
            onClick={handleAddHobby}
            disabled={addingHobby}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {addingHobby ? "Adding..." : "Add Hobby"}
          </button>
        </div>
      </div>

      {/* Address Fields */}
      <div>
        <label className="block text-sm font-medium">Country</label>
        <input
          type="text"
          {...register("country")}
          className="border p-2 w-full"
        />
        {errors.country && (
          <p className="text-red-500 text-xs">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">State</label>
        <input
          type="text"
          {...register("state")}
          className="border p-2 w-full"
        />
        {errors.state && (
          <p className="text-red-500 text-xs">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea {...register("address")} className="border p-2 w-full" />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </form>
  );
}
