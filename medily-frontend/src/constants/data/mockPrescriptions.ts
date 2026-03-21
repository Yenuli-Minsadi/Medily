import type {
  PrescriptionStatus,
  Medication,
  PatientPrescription,
  PharmacyPrescription,
  StatusConfig
} from "../../types/Prescription";
// ─── Pharmacy Dashboard Static Data ────────────────────────────────────────────────────────────────
export const PHARMACY_PRESCRIPTIONS: PharmacyPrescription[] = [
  {
    id: "RX-2024-001",
    patientName: "James Okafor",
    patientAge: 45,
    patientAvatar:
      "https://ui-avatars.com/api/?name=James+Okafor&background=0ea5e9&color=fff",
    doctorName: "Dr. Emily Watson",
    doctorSpecialty: "Cardiology",
    issuedAt: "2024-03-14 08:30",
    expiresAt: "2024-04-14",
    status: "pending",
    urgent: true,
    distance: "0.3 km",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        qty: 21,
        days: 7,
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        qty: 15,
        days: 5,
      },
    ],
    notes: "Patient has known penicillin allergy.",
  },
  {
    id: "RX-2024-002",
    patientName: "Aisha Mohammed",
    patientAge: 32,
    patientAvatar:
      "https://ui-avatars.com/api/?name=Aisha+Mohammed&background=10b981&color=fff",
    doctorName: "Dr. Marcus Reid",
    doctorSpecialty: "General Practice",
    issuedAt: "2024-03-14 09:15",
    expiresAt: "2024-03-28",
    status: "pending",
    urgent: false,
    distance: "0.8 km",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        qty: 21,
        days: 7,
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        qty: 15,
        days: 5,
      },
    ],
  },
  {
    id: "RX-2024-003",
    patientName: "David Fernandez",
    patientAge: 67,
    patientAvatar:
      "https://ui-avatars.com/api/?name=David+Fernandez&background=f59e0b&color=fff",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Endocrinology",
    issuedAt: "2024-03-14 10:00",
    expiresAt: "2024-06-14",
    status: "accepted",
    urgent: false,
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        qty: 21,
        days: 7,
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        qty: 15,
        days: 5,
      },
    ],
  },
  {
    id: "RX-2024-004",
    patientName: "Li Wei",
    patientAge: 28,
    patientAvatar:
      "https://ui-avatars.com/api/?name=Li+Wei&background=8b5cf6&color=fff",
    doctorName: "Dr. Kevin Park",
    doctorSpecialty: "Psychiatry",
    issuedAt: "2024-03-13 14:20",
    expiresAt: "2024-04-13",
    status: "dispensed",
    urgent: false,
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        qty: 21,
        days: 7,
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        qty: 15,
        days: 5,
      },
    ],
    notes: "Controlled substance — verify ID.",
  },
  {
    id: "RX-2024-005",
    patientName: "Sofia Rossi",
    patientAge: 54,
    patientAvatar:
      "https://ui-avatars.com/api/?name=Sofia+Rossi&background=ec4899&color=fff",
    doctorName: "Dr. Lena Fischer",
    doctorSpecialty: "Rheumatology",
    issuedAt: "2024-03-13 11:45",
    expiresAt: "2024-09-13",
    status: "pending",
    urgent: false,
    distance: "1.2 km",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        qty: 21,
        days: 7,
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        qty: 15,
        days: 5,
      },
    ],
    notes: "Weekly dosing — counsel patient carefully.",
  },
];

// Patient Dashboard
// ─── Static Data ───────────────────────────────────────────────────────────────
export const PATIENT_PRESCRIPTIONS: PatientPrescription[] = [
  {
    id: "RX-2024-001",
    doctor: "Dr. Sarah Mitchell",
    specialty: "Cardiologist • UCSF",
    doctorAvatar:
      "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=4f46e5&color=fff",
    date: "Feb 10, 2025",
    diagnosis: "Hypertension + Hyperlipidemia",
    status: "active",
    nextRefill: "Mar 10, 2025",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once at night",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
    ],
    notes: "Monitor BP weekly. Avoid high-sodium foods. Follow-up in 4 weeks.",
  },
  {
    id: "RX-2024-002",
    doctor: "Dr. James Okafor",
    specialty: "Neurologist • Hopkins",
    doctorAvatar:
      "https://ui-avatars.com/api/?name=James+Okafor&background=7c3aed&color=fff",
    date: "Jan 28, 2025",
    diagnosis: "Migraine Prophylaxis",
    status: "active",
    nextRefill: "Feb 28, 2025",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once at night",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
    ],
    notes:
      "Keep a migraine diary. Avoid triggers. Return if frequency increases.",
  },
  {
    id: "RX-2024-003",
    doctor: "Dr. Priya Sharma",
    specialty: "Endocrinologist • Mayo",
    doctorAvatar:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=059669&color=fff",
    date: "Dec 5, 2024",
    diagnosis: "Type 2 Diabetes",
    status: "completed",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once at night",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "30 days",
        qty: 30,
        days: 30,
      },
    ],
    notes: "HbA1c target < 7%. Diet and exercise are critical.",
  },
];

// ─── Derived ───────────────────────────────────────────────────────────────────
// All active medication names across patient prescriptions.
// Used by PharmacyPage to calculate match score against nearby pharmacies.
export const ALL_PRESCRIBED_MEDS = Array.from(
  new Set(
    PATIENT_PRESCRIPTIONS
      .filter((p) => p.status === "active")
      .flatMap((p) => p.medications.map((m) => m.name)),
  ),
);
