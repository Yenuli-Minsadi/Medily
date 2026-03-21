import type { Patient } from "../../types/Patient";
//  From doctor dashboard
// ─── Patient DB (mock) ────────────────────────────────────────────────────────
export const PATIENT_DB: Record<string, string> = {
  "PAT-2025-4821": "Alex Johnson",
  "PAT-2025-1234": "Sarah Williams",
  "PAT-2025-5678": "John Anderson",
  "PAT-2025-9012": "Michael Chen",
  "PAT-2025-3456": "Emma Johnson",
};

// From message page
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    lastMsg: "Is the prescription ready?",
    status: "online",
    initials: "JD",
  },
  {
    id: "2",
    name: "Sarah Smith",
    lastMsg: "Thank you, doctor!",
    status: "offline",
    initials: "SS",
  },
];

