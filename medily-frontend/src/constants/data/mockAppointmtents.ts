import type { Appointment } from "../../types/Appointment";
// Patient dashboard
export const APPOINTMENTS: Appointment[] = [
  {
    id: "apt1",
    doctor: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=4f46e5&color=fff",
    date: "Feb 20, 2025",
    time: "10:00 AM",
    type: "follow-up",
    status: "upcoming",
    location: "UCSF Medical Center, Room 304",
    fee: 150,
  },
  {
    id: "apt2",
    doctor: "Dr. James Okafor",
    specialty: "Neurologist",
    avatar:
      "https://ui-avatars.com/api/?name=James+Okafor&background=7c3aed&color=fff",
    date: "Feb 25, 2025",
    time: "2:30 PM",
    type: "consultation",
    status: "upcoming",
    location: "Johns Hopkins Outpatient, Suite 12",
    fee: 200,
  },
  {
    id: "apt3",
    doctor: "Dr. Priya Sharma",
    specialty: "Endocrinologist",
    avatar:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=059669&color=fff",
    date: "Jan 15, 2025",
    time: "11:00 AM",
    type: "checkup",
    status: "completed",
    location: "Mayo Clinic, Block A",
    fee: 175,
  },
];
