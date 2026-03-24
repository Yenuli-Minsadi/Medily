// PharmacistDashboard.tsx
import React, { useState} from "react";
import type {
  PharmacyPrescription,
  StatusConfig,
  PrescriptionStatus,
  NearbyPatient,
} from "../types";
type Prescription = PharmacyPrescription;
import { NEARBY_PATIENTS } from "../constants/data/mockDoctors";
import { INVENTORY } from "../constants/data/mockInventory";
import { PHARMACY_PRESCRIPTIONS as PRESCRIPTIONS } from "../constants/data/mockPrescriptions";
import { menuItems } from "../constants/data/mockPharmacies";
import type { MenuItem } from "../constants/data/mockPharmacies";

const statusConfig: Record<PrescriptionStatus, StatusConfig> = {
  pending:   { label: "Pending",   classes: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"  },
  accepted:  { label: "Accepted",  classes: "bg-teal-100 text-teal-700",     dot: "bg-teal-400"   },
  dispensed: { label: "Dispensed", classes: "bg-slate-100 text-slate-600",   dot: "bg-slate-400"  },
  rejected:  { label: "Rejected",  classes: "bg-red-100 text-red-600",       dot: "bg-red-400"    },
};

const nearbyStatusConfig: Record<string, StatusConfig> = {
  searching: { label: "Searching", classes: "bg-sky-100 text-sky-700",       dot: "bg-sky-400"    },
  matched:   { label: "Matched",   classes: "bg-teal-100 text-teal-700",     dot: "bg-teal-400"   },
  enroute:   { label: "En Route",  classes: "bg-violet-100 text-violet-700", dot: "bg-violet-400" },
};


// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Grid: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Rx: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  MapPin: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Package: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Users: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.71L23 6H6" />
    </svg>
  ),
  BarChart: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Search: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Pill: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v2" />
      <circle cx="16" cy="19" r="4" />
      <path d="M16 15v4M14 17h4" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Navigation: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ─── Prescription Detail Modal ──────────────────────────────────────────────────
const PrescriptionModal: React.FC<{
  rx: PharmacyPrescription;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ rx, onClose, onAccept, onReject }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
  >
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {rx.urgent && (
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Icon.AlertTriangle /> URGENT
                </span>
              )}
              <span className="text-white/70 text-sm font-mono">{rx.id}</span>
            </div>
            <h2 className="text-xl font-bold">{rx.patientName}</h2>
            <p className="text-white/80 text-sm">
              Age {rx.patientAge} · {rx.doctorName} · {rx.doctorSpecialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <Icon.Close />
          </button>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div>
            <span className="text-white/60">Issued</span>
            <div className="font-semibold">{rx.issuedAt}</div>
          </div>
          <div>
            <span className="text-white/60">Expires</span>
            <div className="font-semibold">{rx.expiresAt}</div>
          </div>
          {rx.distance && (
            <div>
              <span className="text-white/60">Distance</span>
              <div className="font-semibold">{rx.distance}</div>
            </div>
          )}
        </div>
      </div>

      {/* Medications */}
      <div className="p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Medications
        </h3>
        <div className="space-y-2">
          {rx.medications.map((med, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                  <Icon.Pill />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    {med.name}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {med.dosage} · {med.days} days
                  </div>
                </div>
              </div>
              <span className="bg-teal-100 text-teal-700 font-bold text-sm px-3 py-1 rounded-full">
                {med.qty} {med.qty === 1 ? "tab" : "tabs"}
              </span>
            </div>
          ))}
        </div>

        {rx.notes && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2">
            <Icon.AlertTriangle />
            <p className="text-amber-800 text-sm font-medium">{rx.notes}</p>
          </div>
        )}

        {/* Actions */}
        {rx.status === "pending" && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                onReject(rx.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
            >
              <Icon.X /> Decline
            </button>
            <button
              onClick={() => {
                onAccept(rx.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-teal-200"
            >
              <Icon.Check /> Accept Prescription
            </button>
          </div>
        )}
        {rx.status !== "pending" && (
          <div
            className={`mt-6 rounded-2xl py-3 text-center font-bold text-sm ${statusConfig[rx.status].classes}`}
          >
            {statusConfig[rx.status].label}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── Overview Page ──────────────────────────────────────────────────────────────
const OverviewPage: React.FC<{
  prescriptions: Prescription[];
  nearby: NearbyPatient[];
  onViewRx: (rx: Prescription) => void;
  onAccept: (id: string) => void;
}> = ({ prescriptions, nearby, onViewRx, onAccept }) => {
  const pending = prescriptions.filter((p) => p.status === "pending").length;
  const accepted = prescriptions.filter((p) => p.status === "accepted").length;
  const dispensed = prescriptions.filter(
    (p) => p.status === "dispensed",
  ).length;
  const lowStock = INVENTORY.filter((i) => i.stock <= i.threshold).length;

  const stats = [
    {
      label: "Pending Requests",
      value: pending,
      sub: "Awaiting review",
      color: "from-amber-400 to-orange-500",
      icon: "📋",
    },
    {
      label: "Accepted Today",
      value: accepted,
      sub: "In preparation",
      color: "from-teal-400 to-emerald-500",
      icon: "✅",
    },
    {
      label: "Dispensed Today",
      value: dispensed,
      sub: "Completed",
      color: "from-slate-400 to-slate-500",
      icon: "💊",
    },
    {
      label: "Low Stock Alerts",
      value: lowStock,
      sub: "Items to reorder",
      color: "from-rose-400 to-red-500",
      icon: "⚠️",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pharmacist card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f766e 0%, #059669 50%, #047857 100%)",
        }}
      >
        <div className="px-8 py-7 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="https://ui-avatars.com/api/?name=Pharmacy+Staff&background=fff&color=0f766e&size=80"
                alt=""
                className="w-16 h-16 rounded-2xl border-4 border-white/30"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full border-2 border-white" />
            </div>
            <div className="text-white">
              <p className="text-white/70 text-sm font-medium">
                Licensed Pharmacist
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight">
                PharmaCare Negombo
              </h2>
              <p className="text-white/60 text-sm mt-0.5">
                Reg No: PH-2024-NCB-0041 · Est. 2009
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-white text-center">
            <div>
              <div className="text-3xl font-black">{pending}</div>
              <div className="text-white/60 text-xs mt-0.5">Pending</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-black">4.8</div>
              <div className="text-white/60 text-xs mt-0.5">Rating ⭐</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-black">{nearby.length}</div>
              <div className="text-white/60 text-xs mt-0.5">Nearby</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}
            >
              {s.icon}
            </div>
            <div className="text-2xl font-black text-slate-800">{s.value}</div>
            <div className="text-sm font-semibold text-slate-700 mt-0.5">
              {s.label}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pending prescriptions quick view */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Pending Prescriptions</h3>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {pending} new
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {prescriptions
              .filter((p) => p.status === "pending")
              .slice(0, 3)
              .map((rx) => (
                <div
                  key={rx.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={rx.patientAvatar}
                    alt=""
                    className="w-9 h-9 rounded-full border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm truncate">
                        {rx.patientName}
                      </span>
                      {rx.urgent && (
                        <span className="flex-shrink-0 bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-md">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {rx.medications.length} medication
                      {rx.medications.length !== 1 ? "s" : ""} · {rx.distance}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(rx.id)}
                      className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-200 transition-colors"
                    >
                      <Icon.Check />
                    </button>
                    <button
                      onClick={() => onViewRx(rx)}
                      className="w-7 h-7 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Icon.Eye />
                    </button>
                  </div>
                </div>
              ))}
            {pending === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">
                No pending prescriptions
              </div>
            )}
          </div>
        </div>

        {/* Nearby patients */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Patients Nearby</h3>
            <span className="flex items-center gap-1 text-xs text-sky-600 font-semibold bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />{" "}
              Live
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {nearby.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full border border-slate-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-400 flex items-center gap-0.5">
                      <Icon.Navigation />
                      {p.distance}
                    </span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">
                      {p.requestedAt}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${nearbyStatusConfig[p.status].classes}`}
                >
                  {nearbyStatusConfig[p.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
            <Icon.AlertTriangle />
          </div>
          <div className="flex-1">
            <div className="font-bold text-rose-800 text-sm">
              {lowStock} items below reorder threshold
            </div>
            <div className="text-rose-600 text-xs mt-0.5">
              {INVENTORY.filter((i) => i.stock <= i.threshold)
                .map((i) => i.name)
                .join(", ")}
            </div>
          </div>
          <button className="text-rose-600 font-bold text-sm hover:text-rose-700 whitespace-nowrap">
            View Inventory →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Prescriptions Page ─────────────────────────────────────────────────────────
const PrescriptionsPage: React.FC<{
  prescriptions: Prescription[];
  onView: (rx: Prescription) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ prescriptions, onView, onAccept, onReject }) => {
  const [filter, setFilter] = useState<"all" | PrescriptionStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = prescriptions.filter((rx) => {
    const matchStatus = filter === "all" || rx.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      rx.patientName.toLowerCase().includes(q) ||
      rx.id.toLowerCase().includes(q) ||
      rx.doctorName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Prescription Requests
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Review and manage incoming prescription orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, RX ID…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-teal-400 transition-colors w-56"
          />
        </div>
        <div className="flex gap-2">
          {(
            ["all", "pending", "accepted", "dispensed", "rejected"] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? "bg-teal-600 text-white shadow-md shadow-teal-200" : "bg-white text-slate-500 border border-slate-200 hover:border-teal-300"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Patient
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  RX ID
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Prescribed By
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Medications
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Distance
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((rx) => {
                const sc = statusConfig[rx.status];
                return (
                  <tr
                    key={rx.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={rx.patientAvatar}
                          alt=""
                          className="w-8 h-8 rounded-full border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            {rx.patientName}
                            {rx.urgent && (
                              <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">
                                !
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            Age {rx.patientAge}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {rx.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-slate-700">
                        {rx.doctorName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {rx.doctorSpecialty}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-700">
                        {rx.medications[0].name}
                      </div>
                      {rx.medications.length > 1 && (
                        <div className="text-xs text-slate-400">
                          +{rx.medications.length - 1} more
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">
                        {rx.distance ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.classes}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onView(rx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Icon.Eye />
                        </button>
                        {rx.status === "pending" && (
                          <>
                            <button
                              onClick={() => onAccept(rx.id)}
                              className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                            >
                              <Icon.Check />
                            </button>
                            <button
                              onClick={() => onReject(rx.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Icon.X />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500 font-medium">
                No prescriptions found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Nearby Page ────────────────────────────────────────────────────────────────
const NearbyPage: React.FC<{
  nearby: NearbyPatient[];
  prescriptions: Prescription[];
  onAccept: (rxId: string) => void;
}> = ({ nearby, prescriptions, onAccept }) => {
  const getRx = (rxId: string) => prescriptions.find((p) => p.id === rxId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Patients Searching Nearby
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Patients who are looking for the nearest pharmacy for their
            prescription
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm text-sky-600 font-semibold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-full">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
          {nearby.length} searching now
        </span>
      </div>

      {/* Map placeholder */}
      <div
        className="relative bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-dashed border-teal-200 rounded-3xl overflow-hidden"
        style={{ height: 220 }}
      >
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
          <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
            <Icon.MapPin />
          </div>
          <div className="text-center">
            <p className="font-bold text-teal-800">PharmaCare Negombo</p>
            <p className="text-teal-600 text-sm">
              Showing {nearby.length} patients within 3 km radius
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-40 h-40 rounded-full border-2 border-teal-300/40 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute w-64 h-64 rounded-full border border-teal-200/30" />
          <div className="absolute w-96 h-96 rounded-full border border-teal-100/20" />
        </div>
        {/* Distance markers */}
        {nearby.map((p, i) => {
          const angle = (i / nearby.length) * 360;
          const radius = Math.min(p.distanceKm * 55, 120);
          const x =
            50 + (radius / 240) * 50 * Math.cos((angle * Math.PI) / 180);
          const y =
            50 + (radius / 240) * 50 * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%,-50%)",
              }}
              className="group cursor-pointer"
            >
              <img
                src={p.avatar}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              />
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {p.name} · {p.distance}
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {nearby
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .map((patient) => {
            const rx = getRx(patient.prescription);
            const sc = nearbyStatusConfig[patient.status];
            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={patient.avatar}
                      alt=""
                      className="w-12 h-12 rounded-2xl border border-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {patient.distance}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-800">
                        {patient.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.classes}`}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Icon.Phone />
                      {patient.phone}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Requested {patient.requestedAt}
                    </div>
                    {rx && (
                      <div className="mt-2 bg-slate-50 rounded-xl px-3 py-2">
                        <div className="text-xs font-semibold text-slate-500 mb-1">
                          Prescription {patient.prescription}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {rx.medications.map((m, i) => (
                            <span
                              key={i}
                              className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                              {m.name} {m.dosage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {rx?.status === "pending" && (
                  <div className="border-t border-slate-100 px-5 py-3 flex gap-2 bg-slate-50/50">
                    <button className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                      <Icon.Phone /> Call Patient
                    </button>
                    <button
                      onClick={() => onAccept(patient.prescription)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow shadow-teal-200"
                    >
                      <Icon.Check /> Accept RX
                    </button>
                  </div>
                )}
                {rx?.status === "accepted" && (
                  <div className="border-t border-teal-100 px-5 py-3 bg-teal-50/50 text-center text-sm font-semibold text-teal-700">
                    ✓ Prescription Accepted — Ready for pickup
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ─── Inventory Page ─────────────────────────────────────────────────────────────
const InventoryPage: React.FC = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Inventory Management
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Monitor stock levels and manage reorders
        </p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors">
        + Add Stock
      </button>
    </div>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {[
              "Medication",
              "Category",
              "Stock Level",
              "Expiry",
              "Supplier",
              "Status",
            ].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {INVENTORY.map((item) => {
            const pct = Math.min(
              (item.stock / (item.threshold * 3)) * 100,
              100,
            );
            const isLow = item.stock <= item.threshold;
            const isCritical = item.stock <= item.threshold * 0.3;
            return (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    {isCritical && (
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                    )}
                    {item.name}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 w-24">
                      <div
                        className={`h-2 rounded-full transition-all ${isCritical ? "bg-red-500" : isLow ? "bg-amber-400" : "bg-teal-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-700"}`}
                    >
                      {item.stock} {item.unit}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600 font-mono">
                    {item.expiresAt}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-500">
                    {item.supplier}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {isCritical ? (
                    <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full">
                      Critical
                    </span>
                  ) : isLow ? (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
                      Reorder
                    </span>
                  ) : (
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-2.5 py-1 rounded-full">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Analytics Page ─────────────────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const dispensed = [124, 138, 115, 162, 145, 189];
  const max = Math.max(...dispensed);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Analytics & Reports
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Track pharmacy performance and prescription trends
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Dispensed (Month)",
            value: "189",
            delta: "+12%",
            pos: true,
          },
          {
            label: "Avg Fill Time",
            value: "18 min",
            delta: "-4 min",
            pos: true,
          },
          {
            label: "Revenue (Month)",
            value: "LKR 284k",
            delta: "+8%",
            pos: true,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="text-slate-400 text-sm">{s.label}</div>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {s.value}
            </div>
            <div
              className={`text-sm font-semibold mt-1 ${s.pos ? "text-teal-600" : "text-red-500"}`}
            >
              {s.delta} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">
          Prescriptions Dispensed — 2024
        </h3>
        <div className="flex items-end gap-3 h-40">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                {dispensed[i]}
              </span>
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-emerald-400 transition-all"
                style={{ height: `${(dispensed[i] / max) * 120}px` }}
              />
              <span className="text-xs text-slate-400 font-medium">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">
          Top Dispensed Categories
        </h3>
        <div className="space-y-3">
          {[
            { label: "Cardiovascular", pct: 32, color: "bg-rose-400" },
            { label: "Diabetes", pct: 24, color: "bg-amber-400" },
            { label: "Antibiotics", pct: 18, color: "bg-teal-500" },
            { label: "Psychiatry", pct: 14, color: "bg-violet-400" },
            { label: "Other", pct: 12, color: "bg-slate-300" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32 flex-shrink-0">
                {c.label}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5">
                <div
                  className={`${c.color} h-2.5 rounded-full`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-600 w-10 text-right">
                {c.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Placeholder Page ───────────────────────────────────────────────────────────
const PlaceholderPage: React.FC<{
  icon: string;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <div className="flex items-center justify-center min-h-80">
    <div className="text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-slate-700">{title}</h2>
      <p className="text-slate-400 mt-2">{desc}</p>
    </div>
  </div>
);

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
const PharmacistDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(PRESCRIPTIONS);
  const [nearby] = useState<NearbyPatient[]>(NEARBY_PATIENTS);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAccept = (id: string) =>
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "accepted" } : p)),
    );

  const handleReject = (id: string) =>
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)),
    );

  const pendingCount = prescriptions.filter(
    (p) => p.status === "pending",
  ).length;
  const nearbyCount = nearby.filter((n) => n.status === "searching").length;

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return (
          <OverviewPage
            prescriptions={prescriptions}
            nearby={nearby}
            onViewRx={setSelectedRx}
            onAccept={handleAccept}
          />
        );
      case "prescriptions":
        return (
          <PrescriptionsPage
            prescriptions={prescriptions}
            onView={setSelectedRx}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case "nearby":
        return (
          <NearbyPage
            nearby={nearby}
            prescriptions={prescriptions}
            onAccept={handleAccept}
          />
        );
      case "inventory":
        return <InventoryPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "patients":
        return (
          <PlaceholderPage
            icon="👥"
            title="Patient Records"
            desc="View and manage patient medication history"
          />
        );
      case "orders":
        return (
          <PlaceholderPage
            icon="🛒"
            title="Supplier Orders"
            desc="Manage stock orders from pharmaceutical suppliers"
          />
        );
      case "settings":
        return (
          <PlaceholderPage
            icon="⚙️"
            title="Settings"
            desc="Configure pharmacy preferences and staff access"
          />
        );
      default:
        return null;
    }
  };

  const pageTitles: Record<MenuItem, string> = {
    overview: "Good Morning, Pharmacist",
    prescriptions: "Prescription Requests",
    nearby: "Nearby Patients",
    inventory: "Inventory",
    patients: "Patients",
    orders: "Orders",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-100 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow shadow-teal-200">
            Rx
          </div>
          <div>
            <div className="font-extrabold text-slate-800 leading-tight">
              PharmaCare
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Negombo Branch
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon.Close />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === item.id
                  ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <span className={activeMenu === item.id ? "text-white" : ""}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeMenu === item.id ? "bg-white/20 text-white" : "bg-teal-100 text-teal-700"}`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <img
              src="https://ui-avatars.com/api/?name=Pharmacy+Staff&background=0f766e&color=fff&size=80"
              alt=""
              className="w-8 h-8 rounded-lg border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">
                Nalini Perera
              </div>
              <div className="text-xs text-slate-400">Chief Pharmacist</div>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <Icon.Logout /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex-shrink-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon.Menu />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-800 leading-tight">
              {pageTitles[activeMenu]}
            </h1>
            <p className="text-xs text-slate-400">Saturday, 14 March 2026</p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon.Search />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prescriptions, patients…"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:border-teal-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Icon.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-teal-400 transition-colors">
              <img
                src="https://ui-avatars.com/api/?name=Nalini+Perera&background=0f766e&color=fff&size=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {renderContent()}
        </main>
      </div>

      {/* Prescription modal */}
      {selectedRx && (
        <PrescriptionModal
          rx={selectedRx}
          onClose={() => setSelectedRx(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default PharmacistDashboard;
