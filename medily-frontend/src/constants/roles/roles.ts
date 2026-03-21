//From signup
export const roleOptions = [
  {
    value: "patient",
    label: "Patient",
    description: "Manage your health records & appointments",
  },
  {
    value: "doctor",
    label: "Doctor",
    description: "Access patient records & manage consultations",
  },
  {
    value: "hospital",
    label: "Hospital / Clinic",
    description: "Coordinate staff, patients & operations",
  },
];

// From login
// ─── Credentials ──────────────────────────────────────────────────────────────
export const DOCTOR_CREDENTIALS = {
  email: "doctor@medily.com",
  password: "doctor123",
  role: "doctor",
  name: "Dr. Sarah Mitchell",
};

export const PATIENT_CREDENTIALS = {
  email: "patient@medily.com",
  password: "patient123",
  role: "patient",
  name: "Alex Johnson",
};

export const PHARMACIST_CREDENTIALS = {
  email: "pharmacy@medily.com",
  password: "pharmacy123",
  role: "pharmacist",
  name: "MedPlus Pharmacy",
};

