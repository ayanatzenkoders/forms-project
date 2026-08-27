// Types come from the shared schema file (not from the Page components), so
// there is no circular dependency and the server could reuse them later.
import {
  Page1Values,
  Page2Values,
  Page3Values,
  Page4Values,
  Page5Values,
} from "./schemas";

export interface PractitionerFormData {
  ProfileInfo1: Partial<Page1Values>;
  workratings: Partial<Page2Values>;
  issues: Partial<Page3Values>;
  cancerHistory: Partial<Page4Values>;
  payment: Partial<Page5Values>;
}

/*
 * Type-safe updateSection: the generic <K> captures WHICH section you pass and
 * JadeFormData[K] forces `data` to match that section's shape. (`data: {}`
 * would mean "any non-null value" - no safety at all.)
 */
export type UpdatePractitionerSection = <K extends keyof PractitionerFormData>(
  section: K,
  data: PractitionerFormData[K],
) => void;
