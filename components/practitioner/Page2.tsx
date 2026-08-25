"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PractitionerFormData } from "./types";
import { z } from "zod";

interface Props {
  nextPage: () => void;
  prevPage: () => void;
  updateSection: (section: keyof PractitionerFormData, data: any) => void;
  formData: PractitionerFormData;
}

const THERAPISTS = [
  "Physiotherapist",
  "Chiropractor",
  "Osteopath",
  "Myotherapist",
  "Remedial Massage Therapist",
  "Acupuncturist",
];

const page2Schema = z.object({
  workratings: z.array(
    z.object({
      therapist: z.string(),
      stars: z.number().min(1, "Select at least 1 star").max(5),
    }),
  ),
});

export type Page2Values = z.infer<typeof page2Schema>;

export default function Page2({
  nextPage,
  prevPage,
  updateSection,
  formData,
}: Props) {
  const {
    control, // Control is an object for connection between React Hook Form & special form components. pass it inside useFieldArray()
    watch,
    handleSubmit,
    setValue, // tool to use the state object of created Page2Values
    formState: { errors }, // Create state object for Page2Values
  } = useForm<Page2Values>({
    resolver: zodResolver(page2Schema),

    defaultValues: {
      workratings:
        formData.workratings.workratings &&
        (formData.workratings.workratings?.length ?? 0) > 0 // Check if user already visit Because then internal "workratings" inside workratings not created.
          ? formData.workratings.workratings
          : THERAPISTS.map((therapist) => ({
              // Otherwise add workratings array of object: workratings = [{}, {}, {}] in which each obj therapist, rating.
              therapist,
              stars: 0,
            })),
    },
  });

  // Built-in inside the react-hook-form to manage Arrays. Inside it we give control & the name of array which exist inside our type(we create form for), it ask for name of array.
  // use form -> give us "control" -> Pass "control" to useFieldArray, Pass the thing we want useFieldArray manage
  const { fields } = useFieldArray({
    control,
    name: "workratings",
  }); // Now fields is defined by react-hook-form and using control copy all values and give tag: "workratings". Now if we

  const onSubmit = (data: Page2Values) => {
    updateSection("workratings", data);
    nextPage();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 space-y-6 border rounded-lg bg-white shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold mb-1">Complete Profile</h2>
        <p className="text-sm text-gray-600">
          Please select which of the following you have used in the past and
          rate how well they worked for you. (out of 5 stars)
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const ratings = watch("workratings"); //It immediatly see the change. (for better and fast UI changes)
          return (
            <div
              key={field.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="text-sm font-medium text-gray-700">
                {field.therapist}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setValue(`workratings.${index}.stars`, star)}
                    className={`text-xl transition-colors ${
                      ratings?.[index].stars >= star // without watch we can do (field.stars >= star) but it does not immediately update.
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {errors.workratings && (
        <p className="text-red-500 text-xs">Please provide valid ratings.</p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevPage}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-slate-800 text-white rounded font-medium hover:bg-slate-900"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
