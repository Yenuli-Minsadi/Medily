export type PrescriptionStatus =
  | "pending"
  | "accepted"
  | "dispensed"
  | "rejected";

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  qty: number;
  days?: number;
}

// Patient-facing prescription (from their doctor)
export interface PatientPrescription {
  id: string;
  doctor: string;
  doctorAvatar: string;
  specialty: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  status: "active" | "completed";
  nextRefill?: string;
}

// Pharmacist-facing prescription (incoming from patients)
export interface PharmacyPrescription {
  id: string;
  patientName: string;
  patientAge: number;
  patientAvatar: string;
  doctorName: string;
  doctorSpecialty: string;
  medications: Medication[];
  status: PrescriptionStatus;
  issuedAt: string;
  expiresAt: string;
  notes?: string;
  urgent?: boolean;
  distance?: string;
}

export interface StatusConfig {
  label: string;
  classes: string;
  dot: string;
}
