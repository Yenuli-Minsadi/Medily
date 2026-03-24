import React from "react";
import {
  LayoutDashboard,
  Newspaper,
  Bookmark,
  CalendarDays,
  Users,
  FileText,
  MessageSquare,
  BarChart2,
  Building2,
  CreditCard,
  MapPin,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";
import type {
  DoctorMenuItem,
  PatientMenuItem,
  PharmacyMenuItem,
} from "../../types/Ui";
export type {
  DoctorMenuItem,
  PatientMenuItem,
  PharmacyMenuItem,
} from "../../types/Ui";


// ─── Doctor Dashboard Nav Items ─────────────────────────────────────────────────
export const DOCTOR_NAV_ITEMS: {
  id: DoctorMenuItem;
  label: string;
  badge?: number;
  icon: React.ReactNode;
}[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "feed", label: "Medical Feed", icon: <Newspaper size={18} /> },
  { id: "saved", label: "Saved", icon: <Bookmark size={18} /> },
  // badge will be replaced with live API count when backend is connected
  {
    id: "appointments",
    label: "Appointments",
    icon: <CalendarDays size={18} />,
    badge: 3,
  },
  { id: "patients", label: "Patients", icon: <Users size={18} /> },
  { id: "prescriptions", label: "Prescriptions", icon: <FileText size={18} /> },
  // badge will be replaced with live API count when backend is connected
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare size={18} />,
    badge: 5,
  },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
];

// ─── Doctor Dashboard Page Titles ──────────────────────────────────────────────
export const DOCTOR_PAGE_TITLES: Record<
  DoctorMenuItem,
  { title: string; subtitle: string }
> = {
  overview: { title: "Dr. Sarah Mitchell", subtitle: "Cardiologist" },
  feed: { title: "Medical Feed", subtitle: "Community Updates" },
  saved: { title: "Saved", subtitle: "Your bookmarked posts" },
  appointments: { title: "Appointments", subtitle: "Manage your schedule" },
  patients: { title: "Patients", subtitle: "Patient records" },
  prescriptions: { title: "Prescriptions", subtitle: "Manage prescriptions" },
  messages: { title: "Messages", subtitle: "Patient communications" },
  analytics: { title: "Analytics", subtitle: "Practice insights" },
};

// ─── Patient Dashboard Nav Items ────────────────────────────────────────────────
export const PATIENT_NAV_ITEMS: {
  id: PatientMenuItem;
  label: string;
  badge?: number;
  icon: React.ReactNode;
}[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "feed", label: "Medical Feed", icon: <Newspaper size={18} /> },
  { id: "saved", label: "Saved", icon: <Bookmark size={18} /> },
  // badge will be replaced with live API count when backend is connected
  {
    id: "prescriptions",
    label: "Prescriptions",
    icon: <FileText size={18} />,
    badge: 2,
  },
  // badge will be replaced with live API count when backend is connected
  {
    id: "appointments",
    label: "Appointments",
    icon: <CalendarDays size={18} />,
    badge: 2,
  },
  { id: "pharmacy", label: "Find Pharmacy", icon: <Building2 size={18} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  // badge will be replaced with live API count when backend is connected
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare size={18} />,
    badge: 3,
  },
];

// ─── Patient Dashboard Page Titles ─────────────────────────────────────────────
export const PATIENT_PAGE_TITLES: Record<PatientMenuItem, string> = {
  overview: "Dashboard",
  feed: "Medical Feed",
  saved: "Saved",
  prescriptions: "My Prescriptions",
  appointments: "Appointments",
  pharmacy: "Find Pharmacy",
  payments: "Payments",
  messages: "Messages",
};

// ─── Pharmacist Dashboard Nav Items ─────────────────────────────────────────────
// NOTE: No badge values here — badges are runtime state values that only exist
// inside PharmacistDashboard.tsx (pendingCount, nearbyCount, lowStockCount).
//
// HOW TO USE in PharmacistDashboard.tsx:
//
//   import { PHARMACIST_NAV_ITEMS } from "../constants/menu/sidebarMenu";
//
//   // inside the component, after state declarations:
//   const navItems = PHARMACIST_NAV_ITEMS.map(item => ({
//     ...item,
//     badge:
//       item.id === "prescriptions" ? pendingCount :
//       item.id === "nearby"        ? nearbyCount  :
//       item.id === "inventory"     ? INVENTORY.filter(i => i.stock <= i.threshold).length :
//       undefined
//   }))
//
//   // then use navItems in your sidebar JSX instead of menuItems
export const PHARMACY_NAV_ITEMS: {
  id: PharmacyMenuItem;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "prescriptions", label: "Prescriptions", icon: <FileText size={18} /> },
  { id: "nearby", label: "Nearby Patients", icon: <MapPin size={18} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={18} /> },
  { id: "patients", label: "Patients", icon: <Users size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

// ─── Pharmacist Dashboard Page Titles ──────────────────────────────────────────
export const PHARMACIST_PAGE_TITLES: Record<PharmacyMenuItem, string> = {
  overview: "Good Morning, Pharmacist",
  prescriptions: "Prescription Requests",
  nearby: "Nearby Patients",
  inventory: "Inventory",
  patients: "Patients",
  orders: "Orders",
  analytics: "Analytics",
  settings: "Settings",
};
