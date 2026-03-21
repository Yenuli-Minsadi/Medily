import type React from "react";

export type DoctorMenuItem =
  | "overview"
  | "feed"
  | "saved"
  | "appointments"
  | "patients"
  | "prescriptions"
  | "messages"
  | "analytics";

export type PatientMenuItem =
  | "overview"
  | "feed"
  | "saved"
  | "prescriptions"
  | "appointments"
  | "pharmacy"
  | "payments"
  | "messages";

export type PharmacistMenuItem =
  | "overview"
  | "prescriptions"
  | "nearby"
  | "inventory"
  | "patients"
  | "orders"
  | "analytics"
  | "settings";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}
