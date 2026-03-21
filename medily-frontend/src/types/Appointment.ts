export type AppointmentType = "consultation" | "follow-up" | "checkup";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  avatar: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  location: string;
  fee: number;
}

export interface AvailableDoctor {
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  fee: number;
  nextSlot: string;
}
