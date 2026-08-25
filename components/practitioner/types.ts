import {Page1Values} from "@/components/practitioner/Page1"
import { Page2Values } from "@/components/practitioner/Page2"

export interface PractitionerFormData {
  ProfileInfo1: Partial<Page1Values>;
  workratings: Partial<Page2Values>;
  // professional: Partial<Form3Values>;
}