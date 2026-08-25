// Types now come from the shared schema file (not from the Page components),
// so both client and server can use them without importing UI code.
import {
  Form1Values,
  Form2Values,
  Form3Values,
  Form4Values,
  Form5Values,
  Form6Values,
  Form7Values,
} from "./schemas";

export interface JadeFormData {
  personalInformation: Partial<Form1Values>;
  education: Partial<Form2Values>;
  professional: Partial<Form3Values>;
  specialization: Partial<Form4Values>;
  license: Partial<Form5Values>;
  availability: Partial<Form6Values>;
  banking: Partial<Form7Values>;
}

/*
 * One reusable, type-safe signature for updateSection.
 * The generic <K> captures WHICH section you pass, and JadeFormData[K] forces
 * `data` to match THAT section's shape. So updateSection("banking", ...) only
 * accepts banking data — passing the wrong shape is now a compile error.
 * (Previously it was `data: {}`, which means "any non-null value" = no safety.)
 */
export type UpdateSection = <K extends keyof JadeFormData>(
  section: K,
  data: JadeFormData[K],
) => void;