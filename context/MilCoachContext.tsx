"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  MilCoachFormData,
  UpdateMilCoachSection,
} from "@/components/milcoach/types";

interface MilCoachContextType {
  formData: MilCoachFormData;
  updateSection: UpdateMilCoachSection;
  clearForm: () => void;
  // False until the saved draft has been read from localStorage, so no page
  // mounts with empty data and then flickers to the real values.
  hydrated: boolean;
}

const emptyFormData: MilCoachFormData = {
  personalDetails: {},
  workExperience: {},
  education: {},
};

const MilCoachContext = createContext<MilCoachContextType | null>(null);

export function MilCoachProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<MilCoachFormData>(emptyFormData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("MilCoachFormData");

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved MilCoach form:", error);
      }
    }

    setHydrated(true);
  }, []);

  const updateSection: UpdateMilCoachSection = (section, data) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [section]: data };

      // Save the NEW object: React schedules state updates, so `formData` is
      // not updated yet at this point.
      localStorage.setItem("MilCoachFormData", JSON.stringify(updatedData));

      return updatedData;
    });
  };

  function clearForm() {
    setFormData(emptyFormData);
    localStorage.removeItem("MilCoachFormData");
  }

  return (
    <MilCoachContext.Provider
      value={{ formData, updateSection, clearForm, hydrated }}
    >
      {children}
    </MilCoachContext.Provider>
  );
}

export function useMilCoach() {
  const context = useContext(MilCoachContext);
  if (!context) {
    throw new Error("useMilCoach must be inside MilCoachProvider");
  }
  return context;
}
