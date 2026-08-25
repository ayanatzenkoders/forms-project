"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { JadeFormData, UpdateSection } from "@/components/jade/types";

interface JadeContextType {
  formData: JadeFormData;
  updateSection: UpdateSection;
  clearForm: () => void;
  // False until the saved draft has been read back from localStorage. The
  // wizard waits for this before rendering, so no page ever mounts with empty
  // data and then flickers to the real values.
  hydrated: boolean;
}

const emptyFormData: JadeFormData = {
  personalInformation: {},
  education: {},
  professional: {},
  specialization: {},
  license: {},
  availability: {},
  banking: {},
};

const JadeContext = createContext<JadeContextType | null>(null);

export function JadeProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<JadeFormData>({
    personalInformation: {},
    education: {},
    professional: {},
    specialization: {},
    license: {},
    availability: {},
    banking: {},
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("JadeFormData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse saved Jade form:", error);
      }
    }

    // Whether or not there was saved data, hydration is now complete.
    setHydrated(true);
  }, []);

  const updateSection: UpdateSection = (section, data) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [section]: data,
      };
      // the Data is Updated but the state of formData is not immediately Update. React Schedules the new state
      // Save the NEW data
      localStorage.setItem("JadeFormData", JSON.stringify(updatedData));

      return updatedData;
    });
  }

  function clearForm() {
    setFormData(emptyFormData);
    localStorage.removeItem("JadeFormData");
  }

  return (
    <JadeContext.Provider
      value={{
        formData,
        updateSection,
        clearForm,
        hydrated,
      }}
    >
      {children}
    </JadeContext.Provider>
  );
}

export function useJade() {
  const context = useContext(JadeContext);

  if (!context) {
    throw new Error("useJade must be inside JadeProvider");
  }

  return context;
}
