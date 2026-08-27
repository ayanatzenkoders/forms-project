// Types come from the shared schema file so both client and server can use
// them without importing UI code.
import { Page1Values, Page2Values, Page3Values } from "./schemas";

export interface MilCoachFormData {
  personalDetails: Partial<Page1Values>;
  workExperience: Partial<Page2Values>;
  education: Partial<Page3Values>;
}

/*
 * Type-safe updateSection: <K> captures WHICH section you pass and
 * MilCoachFormData[K] forces `data` to match that section's shape.
 */
export type UpdateMilCoachSection = <K extends keyof MilCoachFormData>(
  section: K,
  data: MilCoachFormData[K],
) => void;
