import type { number } from "framer-motion";

export type ConsultStep =
  | "idle"
  | "enter_id"
  | "active"
  | "end_prompt"
  | "prescribe"
  | "done";

export interface ConsultSession {
  patientId: string;
  patientName: string;
  startTime: number;
  elapsed: number;
  prescriptionIssued: boolean | null;
}

export interface DoctorProfile {
  name: string;
  photo: string;
  title: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  about: string;
  hospital: string;
  location: string;
  availability: string;
  qualifications: string[];
  achievements: string[];
  languages: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}
