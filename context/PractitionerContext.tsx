"use client";

import { createContext, useContext, useState } from "react";

import { PractitionerFormData } from "@/components/practitioner/types";

interface PractitionerContextType {
  formData: PractitionerFormData;
  updateSection: (section: keyof PractitionerFormData, data: {}) => void;
}

const PractionerContext = createContext<PractitionerContextType | null>(null);

export function PractionerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<PractitionerFormData>({
    ProfileInfo1: {},
    workratings: {},
  });

  const updateSection = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  return (
    <PractionerContext.Provider
      value={{
        formData,
        updateSection,
      }}
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
