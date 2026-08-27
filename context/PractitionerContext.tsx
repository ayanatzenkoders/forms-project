"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  PractitionerFormData,
  UpdatePractitionerSection,
} from "@/components/practitioner/types";

interface PractitionerContextType {
  formData: PractitionerFormData;
  updateSection: UpdatePractitionerSection;
  clearForm: () => void;
  // False until the saved draft has been read back from localStorage. The
  // wizard waits for this before rendering, so no page mounts with empty data
  // and then flickers to the real values.
  hydrated: boolean;
}

const emptyFormData: PractitionerFormData = {
  ProfileInfo1: {},
  workratings: {},
  issues: {},
  cancerHistory: {},
  payment: {},
};

const PractionerContext = createContext<PractitionerContextType | null>(null);

export function PractionerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] =
    useState<PractitionerFormData>(emptyFormData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("PractitionerFormData");

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved Practitioner form:", error);
      }
    }

    // Whether or not there was saved data, hydration is now complete.
    setHydrated(true);
  }, []);

  const updateSection: UpdatePractitionerSection = (section, data) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [section]: data };

      // Save the NEW object: React schedules state updates, so `formData` is
      // not updated yet at this point.
      localStorage.setItem(
        "PractitionerFormData",
        JSON.stringify(updatedData),
      );

      return updatedData;
    });
  };

  function clearForm() {
    setFormData(emptyFormData);
    localStorage.removeItem("PractitionerFormData");
  }

  return (
    <PractionerContext.Provider
      value={{ formData, updateSection, clearForm, hydrated }}
    >
      {children}
    </PractionerContext.Provider>
  );
}

export function usePractioner() {
  const context = useContext(PractionerContext);
  if (!context) {
    throw new Error("usePractioner must be inside PractionerProvider");
  }
  return context;
}
