import type { AvailableDoctor } from "../../types/Appointment";
import type { DoctorProfile } from "../../types/Doctor";
import type { NearbyPatient } from "../../types/Pharmacy";
// Patient dashboard
export const AVAILABLE_DOCTORS: AvailableDoctor[] = [
  {
    name: "Dr. Rachel Green",
    specialty: "Dermatologist",
    avatar:
      "https://ui-avatars.com/api/?name=Rachel+Green&background=f59e0b&color=fff",
    rating: 4.9,
    fee: 120,
    nextSlot: "Tomorrow 9AM",
  },
  {
    name: "Dr. Alan Brooke",
    specialty: "General Physician",
    avatar:
      "https://ui-avatars.com/api/?name=Alan+Brooke&background=0ea5e9&color=fff",
    rating: 4.7,
    fee: 80,
    nextSlot: "Today 4PM",
  },
  {
    name: "Dr. Maya Chen",
    specialty: "Psychiatrist",
    avatar:
      "https://ui-avatars.com/api/?name=Maya+Chen&background=ec4899&color=fff",
    rating: 4.8,
    fee: 180,
    nextSlot: "Feb 22, 10AM",
  },
];

// Pharmacy dashboard
export const NEARBY_PATIENTS: NearbyPatient[] = [
  {
    id: "NP-001",
    name: "James Okafor",
    avatar:
      "https://ui-avatars.com/api/?name=James+Okafor&background=0ea5e9&color=fff",
    distance: "0.3 km",
    distanceKm: 0.3,
    prescription: "RX-2024-001",
    requestedAt: "5 min ago",
    phone: "+94 71 234 5678",
    status: "searching",
  },
  {
    id: "NP-002",
    name: "Aisha Mohammed",
    avatar:
      "https://ui-avatars.com/api/?name=Aisha+Mohammed&background=10b981&color=fff",
    distance: "0.8 km",
    distanceKm: 0.8,
    prescription: "RX-2024-002",
    requestedAt: "12 min ago",
    phone: "+94 77 876 5432",
    status: "matched",
  },
  {
    id: "NP-003",
    name: "Sofia Rossi",
    avatar:
      "https://ui-avatars.com/api/?name=Sofia+Rossi&background=ec4899&color=fff",
    distance: "1.2 km",
    distanceKm: 1.2,
    prescription: "RX-2024-005",
    requestedAt: "18 min ago",
    phone: "+94 76 112 3344",
    status: "searching",
  },
  {
    id: "NP-004",
    name: "Ravi Kumar",
    avatar:
      "https://ui-avatars.com/api/?name=Ravi+Kumar&background=f97316&color=fff",
    distance: "2.1 km",
    distanceKm: 2.1,
    prescription: "RX-2024-006",
    requestedAt: "31 min ago",
    phone: "+94 70 998 7654",
    status: "en_route",
  },
];

// Doctor Profile
// Mock data — in real app this comes from API / route params
export const MOCK_DOCTOR_PROFILE: DoctorProfile = {
  name: "Dr. Tanuja Perera",
  photo:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
  title: "Consultant Cardiologist",
  specialty: "Cardiology & Interventional Cardiology",
  experienceYears: 14,
  qualifications: [
    "MBBS – University of Colombo",
    "MD (Medicine) – Postgraduate Institute of Medicine",
    "MRCP (UK)",
    "Fellowship in Interventional Cardiology – Singapore",
  ],
  languages: ["English", "Sinhala", "Tamil"],
  hospital: "Nawaloka Hospital",
  location: "Colombo 03, Sri Lanka",
  availability: "Mon–Fri: 8:30 AM – 1:00 PM | 4:00 PM – 7:30 PM",
  rating: 4.9,
  reviewCount: 128,
  about: `Dr. Tanuja Perera is a highly regarded cardiologist with over 14 years of experience in diagnosing and treating complex cardiovascular conditions. She specializes in interventional procedures including coronary angiography, angioplasty, and stenting.

She is known for her patient-centered approach, clear communication, and dedication to preventive cardiology. Dr. Perera regularly participates in local and international cardiology conferences and has contributed to several research publications on hypertension and coronary artery disease management.`,
  achievements: [
    "Best Outgoing Student – Postgraduate MD Medicine 2015",
    "Gold Medal – Sri Lanka College of Cardiology Annual Sessions 2020",
    "Member – European Society of Cardiology",
  ],
  contact: {
    phone: "+94 11 255 6789",
    email: "dr.tanuja@medily.lk",
    website: "www.medily.lk/doctors/tanuja-perera",
  },
};
