// pages/PatientDashboard.tsx
// Full Patient Dashboard with: Medical Feed, Prescriptions, Appointments, Pharmacy Finder, Stripe Payments
// Built with Tailwind CSS

import React, { useEffect, useState, useRef } from "react";

// ─── Stripe Modal ─────────────────────────────────────────────────────────────
interface StripeModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  onSuccess: () => void;
}

const StripeModal: React.FC<StripeModalProps> = ({
  open,
  onClose,
  amount,
  description,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = async () => {
    if (!cardNumber || !expiry || !cvc || !name) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setProcessing(true);
    // Simulate Stripe processing
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setSuccess(false);
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setName("");
    }, 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  Secure Payment
                </div>
                <div className="text-white/70 text-xs">Powered by Stripe</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
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
            </button>
          </div>
          <div className="mt-4">
            <div className="text-white/70 text-xs uppercase tracking-wider">
              {description}
            </div>
            <div className="text-white text-3xl font-black mt-1">
              ${amount}.00
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-gray-900 font-bold text-lg">
                Payment Successful!
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Your receipt has been emailed.
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Cardholder Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-7 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                      VISA
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Expiry
                  </label>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    CVC
                  </label>
                  <input
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-xs font-medium bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 mt-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Pay ${amount}.00 Securely
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                256-bit SSL encrypted · PCI DSS compliant
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Overview Page ─────────────────────────────────────────────────────────────
const OverviewPage: React.FC<{
  onNavigate: (m: MenuItem) => void;
  onPay: (amt: number, desc: string) => void;
}> = ({ onNavigate, onPay }) => {
  const activePrescriptions = PRESCRIPTIONS.filter(
    (p) => p.status === "active",
  ).length;
  const upcomingApts = APPOINTMENTS.filter(
    (a) => a.status === "upcoming",
  ).length;

  return (
    <div className="space-y-6">
      {/* Patient Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <img
              src="https://ui-avatars.com/api/?name=Alex+Johnson&background=ffffff&color=4f46e5&size=80"
              alt="Patient"
              className="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
              Patient
            </div>
            <h2 className="text-2xl font-black mt-0.5">Alex Johnson</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-white/80">
              <span>DOB: Mar 12, 1990</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span>Blood: O+</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span>ID: PAT-2025-4821</span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-center">
            <div>
              <div className="text-3xl font-black">{activePrescriptions}</div>
              <div className="text-white/70 text-xs">Active Rx</div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block self-center" />
            <div>
              <div className="text-3xl font-black">{upcomingApts}</div>
              <div className="text-white/70 text-xs">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "View Prescriptions",
              icon: "📋",
              color: "from-blue-50 to-indigo-50 border-indigo-100",
              text: "text-indigo-600",
              nav: "prescriptions" as MenuItem,
            },
            {
              label: "Book Appointment",
              icon: "📅",
              color: "from-violet-50 to-purple-50 border-violet-100",
              text: "text-violet-600",
              nav: "appointments" as MenuItem,
            },
            {
              label: "Find Pharmacy",
              icon: "💊",
              color: "from-emerald-50 to-teal-50 border-emerald-100",
              text: "text-emerald-600",
              nav: "pharmacy" as MenuItem,
            },
            {
              label: "Pay Bills",
              icon: "💳",
              color: "from-amber-50 to-orange-50 border-amber-100",
              text: "text-amber-600",
              nav: "payments" as MenuItem,
            },
          ].map((action) => (
            <button
              key={action.nav}
              onClick={() => onNavigate(action.nav)}
              className={`bg-gradient-to-br ${action.color} border rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className={`text-sm font-bold ${action.text}`}>
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Active Prescriptions Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">
              Active Prescriptions
            </h3>
            <button
              onClick={() => onNavigate("prescriptions")}
              className="text-indigo-600 text-xs font-semibold hover:text-indigo-800"
            >
              View all →
            </button>
          </div>
          <div className="p-4 space-y-3">
            {PRESCRIPTIONS.filter((p) => p.status === "active").map((rx) => (
              <div
                key={rx.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <img
                  src={rx.doctorAvatar}
                  alt=""
                  className="w-9 h-9 rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">
                    {rx.doctor}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {rx.medications.length} meds · Refill {rx.nextRefill}
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">
              Upcoming Appointments
            </h3>
            <button
              onClick={() => onNavigate("appointments")}
              className="text-indigo-600 text-xs font-semibold hover:text-indigo-800"
            >
              View all →
            </button>
          </div>
          <div className="p-4 space-y-3">
            {APPOINTMENTS.filter((a) => a.status === "upcoming").map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="bg-indigo-100 rounded-xl px-3 py-2 text-center flex-shrink-0">
                  <div className="text-indigo-700 font-black text-sm">
                    {apt.date.split(", ")[0].split(" ")[1]}
                  </div>
                  <div className="text-indigo-500 text-xs">
                    {apt.date.split(" ")[0]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">
                    {apt.doctor}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {apt.time} · {apt.type}
                  </div>
                </div>
                <button
                  onClick={() =>
                    onPay(apt.fee, `Appointment with ${apt.doctor}`)
                  }
                  className="text-indigo-600 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Pay ${apt.fee}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-4">
          Health Vitals (Last Reading)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Blood Pressure",
              value: "128/82",
              unit: "mmHg",
              icon: "❤️",
              status: "Borderline",
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Heart Rate",
              value: "72",
              unit: "BPM",
              icon: "💓",
              status: "Normal",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Blood Sugar",
              value: "106",
              unit: "mg/dL",
              icon: "🩸",
              status: "Normal",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "BMI",
              value: "24.1",
              unit: "kg/m²",
              icon: "⚖️",
              status: "Healthy",
              color: "text-emerald-600 bg-emerald-50",
            },
          ].map((v) => (
            <div key={v.label} className="p-4 bg-gray-50 rounded-xl">
              <div className="text-xl mb-1.5">{v.icon}</div>
              <div className="text-2xl font-black text-gray-900">
                {v.value}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  {v.unit}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{v.label}</div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${v.color}`}
              >
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Prescriptions Page ───────────────────────────────────────────────────────
const PrescriptionsPage: React.FC<{
  onPayPharmacy: (amt: number, desc: string) => void;
}> = ({ onPayPharmacy }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "active" | "completed">("all");
  const filtered = PRESCRIPTIONS.filter((p) =>
    tab === "all" ? true : p.status === tab,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            My Prescriptions
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            View and manage prescriptions from your doctors
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "active", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${tab === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelected(selected === rx.id ? null : rx.id)}
            >
              <img
                src={rx.doctorAvatar}
                alt=""
                className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{rx.doctor}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${rx.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                  </span>
                </div>
                <div className="text-gray-500 text-xs mt-0.5">
                  {rx.specialty}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span>📋 {rx.id}</span>
                  <span>📅 {rx.date}</span>
                  {rx.nextRefill && <span>🔄 Refill: {rx.nextRefill}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-400">Diagnosis</div>
                  <div className="text-sm font-semibold text-gray-700 max-w-[140px] text-right">
                    {rx.diagnosis}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${selected === rx.id ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Expanded */}
            {selected === rx.id && (
              <div className="border-t border-gray-50 p-5 space-y-4 bg-gray-50/50">
                {/* Medications */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Prescribed Medications
                  </h4>
                  <div className="space-y-2">
                    {rx.medications.map((med, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100"
                      >
                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">💊</span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1">
                          <div>
                            <div className="text-xs text-gray-400">
                              Medicine
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              {med.name}{" "}
                              <span className="text-indigo-600">
                                {med.dosage}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">
                              Frequency
                            </div>
                            <div className="text-sm font-semibold text-gray-700">
                              {med.frequency}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">
                              Duration
                            </div>
                            <div className="text-sm font-semibold text-gray-700">
                              {med.duration}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">
                              Quantity
                            </div>
                            <div className="text-sm font-semibold text-gray-700">
                              {med.qty} units
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>📝</span>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Doctor's Notes
                    </span>
                  </div>
                  <p className="text-sm text-amber-900">{rx.notes}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() =>
                      onPayPharmacy(
                        rx.medications.reduce((a, m) => a + m.qty * 2, 0),
                        `Medications from ${rx.id}`,
                      )
                    }
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Pay for Meds
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Appointments Page ────────────────────────────────────────────────────────
const AppointmentsPage: React.FC<{
  onPay: (amt: number, desc: string) => void;
}> = ({ onPay }) => {
  const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
  const [bookedSlot, setBookedSlot] = useState<{ [k: string]: string }>({});

  const timeSlots = [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "2:00 PM",
    "3:30 PM",
    "5:00 PM",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Book, manage, and track your doctor visits
        </p>
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Upcoming
        </h3>
        <div className="space-y-3">
          {APPOINTMENTS.filter((a) => a.status === "upcoming").map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={apt.avatar}
                  alt=""
                  className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-gray-900">{apt.doctor}</div>
                  <div className="text-gray-500 text-xs">{apt.specialty}</div>
                  <div className="flex items-center flex-wrap gap-2 mt-1.5 text-xs text-gray-400">
                    <span>📅 {apt.date}</span>
                    <span>🕐 {apt.time}</span>
                    <span>📍 {apt.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${apt.type === "follow-up" ? "bg-violet-100 text-violet-700" : apt.type === "consultation" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}`}
                >
                  {apt.type}
                </span>
                <button
                  onClick={() =>
                    onPay(apt.fee, `Appointment with ${apt.doctor}`)
                  }
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 whitespace-nowrap"
                >
                  Pay ${apt.fee}
                </button>
                <button className="border border-red-200 text-red-500 text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book New */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Book a New Appointment
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_DOCTORS.map((doc) => (
            <div
              key={doc.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={doc.avatar}
                    alt=""
                    className="w-11 h-11 rounded-xl"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {doc.name}
                    </div>
                    <div className="text-gray-500 text-xs">{doc.specialty}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>⭐ {doc.rating}</span>
                  <span>💲{doc.fee}/session</span>
                  <span>🕐 {doc.nextSlot}</span>
                </div>

                {bookingDoctor === doc.name ? (
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-2">
                      Select time slot:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() =>
                            setBookedSlot((b) => ({ ...b, [doc.name]: slot }))
                          }
                          className={`text-xs py-1.5 rounded-lg font-semibold transition-all ${bookedSlot[doc.name] === slot ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingDoctor(null)}
                        className="flex-1 border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!bookedSlot[doc.name]}
                        onClick={() => {
                          setBookingDoctor(null);
                        }}
                        className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl disabled:opacity-40 hover:bg-indigo-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setBookingDoctor(doc.name)}
                    className="w-full bg-indigo-50 text-indigo-700 text-sm font-bold py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Past Appointments
        </h3>
        {APPOINTMENTS.filter((a) => a.status === "completed").map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 opacity-70"
          >
            <img
              src={apt.avatar}
              alt=""
              className="w-10 h-10 rounded-xl flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-700 text-sm">
                {apt.doctor}
              </div>
              <div className="text-gray-400 text-xs">
                {apt.date} · {apt.time}
              </div>
            </div>
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
              Completed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Pharmacy Finder Page ─────────────────────────────────────────────────────
const PharmacyPage: React.FC<{
  onPay: (amt: number, desc: string) => void;
}> = ({ onPay }) => {
  const [search, setSearch] = useState("");
  const [selectedRx, setSelectedRx] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const activePrescriptions = PRESCRIPTIONS.filter(
    (p) => p.status === "active",
  );
  const prescribedMeds = selectedRx
    ? (PRESCRIPTIONS.find((p) => p.id === selectedRx)?.medications.map(
        (m) => m.name,
      ) ?? ALL_PRESCRIBED_MEDS)
    : ALL_PRESCRIBED_MEDS;

  const pharmacies = PHARMACIES.map((ph) => ({
    ...ph,
    matchCount: ph.availableMeds.filter((m) => prescribedMeds.includes(m))
      .length,
    matchScore: Math.round(
      (ph.availableMeds.filter((m) => prescribedMeds.includes(m)).length /
        prescribedMeds.length) *
        100,
    ),
  }))
    .filter(
      (ph) =>
        !search ||
        ph.name.toLowerCase().includes(search.toLowerCase()) ||
        ph.address.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Find Pharmacy</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Nearby pharmacies ranked by availability of your prescribed
          medications
        </p>
      </div>

      {/* Filter by Prescription */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
        <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
          Filter by Prescription
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRx(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!selectedRx ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-indigo-600 border border-indigo-200"}`}
          >
            All Active Rx ({ALL_PRESCRIBED_MEDS.length} meds)
          </button>
          {activePrescriptions.map((rx) => (
            <button
              key={rx.id}
              onClick={() => setSelectedRx(rx.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedRx === rx.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-indigo-600 border border-indigo-200"}`}
            >
              {rx.id} ({rx.medications.length} meds)
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {prescribedMeds.map((m) => (
            <span
              key={m}
              className="bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              💊 {m}
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pharmacies by name or area…"
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
        />
      </div>

      {/* Pharmacy Cards */}
      <div className="space-y-4">
        {pharmacies.map((ph, idx) => (
          <div
            key={ph.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${idx === 0 ? "border-indigo-200 ring-1 ring-indigo-100" : "border-gray-100"}`}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl ${idx === 0 ? "bg-indigo-100" : "bg-gray-100"}`}
                >
                  🏥
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{ph.name}</span>
                    {idx === 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Best Match
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${ph.open ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                    >
                      {ph.open ? "Open Now" : "Closed"}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    📍 {ph.address}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>📏 {ph.distance}</span>
                    <span>⭐ {ph.rating}</span>
                    <span>📞 {ph.phone}</span>
                  </div>
                </div>

                {/* Match Score */}
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-2xl font-black ${ph.matchScore === 100 ? "text-emerald-600" : ph.matchScore >= 70 ? "text-indigo-600" : ph.matchScore >= 40 ? "text-amber-600" : "text-red-500"}`}
                  >
                    {ph.matchScore}%
                  </div>
                  <div className="text-xs text-gray-400">match</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {ph.matchCount}/{prescribedMeds.length} meds
                  </div>
                </div>
              </div>

              {/* Med availability */}
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  Prescribed medications available here:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {prescribedMeds.map((med) => {
                    const available = ph.availableMeds.includes(med);
                    return (
                      <span
                        key={med}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${available ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-400"}`}
                      >
                        {available ? "✓" : "✗"} {med}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    if (!ph.open) return;
                    const totalEst = ph.matchCount * 25;
                    onPay(totalEst, `Medications from ${ph.name}`);
                  }}
                  disabled={!ph.open}
                  className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Order & Pay (~${ph.matchCount * 25})
                </button>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Get Directions
                </button>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                  📞 Call
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Payments Page ────────────────────────────────────────────────────────────
const PaymentsPage: React.FC<{
  onPay: (amt: number, desc: string) => void;
}> = ({ onPay }) => {
  const transactions = [
    {
      id: "TXN-001",
      desc: "Appointment – Dr. Sarah Mitchell",
      amount: 150,
      date: "Feb 10, 2025",
      status: "paid",
      method: "Visa •• 4242",
    },
    {
      id: "TXN-002",
      desc: "Medications – MedPlus Pharmacy",
      amount: 87,
      date: "Feb 10, 2025",
      status: "paid",
      method: "Visa •• 4242",
    },
    {
      id: "TXN-003",
      desc: "Appointment – Dr. James Okafor",
      amount: 200,
      date: "Jan 28, 2025",
      status: "paid",
      method: "Mastercard •• 5555",
    },
    {
      id: "TXN-004",
      desc: "Medications – CityHealth Drugstore",
      amount: 54,
      date: "Jan 28, 2025",
      status: "paid",
      method: "Mastercard •• 5555",
    },
  ];

  const pending = [
    {
      desc: `Appointment – Dr. Sarah Mitchell`,
      amount: 150,
      date: "Feb 20, 2025",
      id: "apt1",
    },
    {
      desc: `Appointment – Dr. James Okafor`,
      amount: 200,
      date: "Feb 25, 2025",
      id: "apt2",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Payments & Billing
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Manage your medical bills and payment history
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Spent",
            value: "$491",
            icon: "💳",
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            label: "Pending Bills",
            value: "$350",
            icon: "⏳",
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "This Month",
            value: "$237",
            icon: "📅",
            color: "text-emerald-600 bg-emerald-50",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color.split(" ")[0]}`}>
              {s.value}
            </div>
            <div className="text-xs font-medium opacity-70 mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pending */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Pending Payments
        </h3>
        <div className="space-y-3">
          {pending.map((p) => (
            <div
              key={p.id}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                ⏳
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">{p.desc}</div>
                <div className="text-gray-500 text-xs">Due: {p.date}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-gray-900">${p.amount}</div>
                <button
                  onClick={() => onPay(p.amount, p.desc)}
                  className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg mt-1 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Payment History
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {transactions.map((txn, i) => (
            <div
              key={txn.id}
              className={`flex items-center gap-4 p-4 ${i < transactions.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {txn.desc}
                </div>
                <div className="text-gray-400 text-xs">
                  {txn.date} · {txn.method}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-gray-900">${txn.amount}</div>
                <span className="text-xs text-emerald-600 font-bold">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Feed Page ────────────────────────────────────────────────────────────────
const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);
  const cats = [
    "All",
    "Heart Health",
    "Nutrition",
    "Mental Health",
    "Research",
  ];
  const [cat, setCat] = useState("All");

  const toggleLike = (id: number) =>
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  const toggleBookmark = (id: number) =>
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );
  const filtered = posts.filter((p) => cat === "All" || p.category === cat);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Medical Feed</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Health updates curated for your conditions
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${cat === c ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">
                    {post.author}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {post.specialty} · {post.time}
                  </div>
                </div>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${post.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={post.liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-indigo-500 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {post.comments}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`transition-colors ${post.bookmarked ? "text-amber-500" : "text-gray-400 hover:text-amber-400"}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={post.bookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Messages Page ────────────────────────────────────────────────────────────
const MessagesPage: React.FC = () => {
  const chats = [
    {
      name: "Dr. Sarah Mitchell",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=4f46e5&color=fff",
      lastMsg: "Your latest blood pressure readings look better!",
      time: "2m ago",
      unread: 1,
      online: true,
    },
    {
      name: "Dr. James Okafor",
      avatar:
        "https://ui-avatars.com/api/?name=James+Okafor&background=7c3aed&color=fff",
      lastMsg: "Please keep the migraine diary updated.",
      time: "1h ago",
      unread: 0,
      online: false,
    },
    {
      name: "MedPlus Pharmacy",
      avatar:
        "https://ui-avatars.com/api/?name=MedPlus&background=10b981&color=fff",
      lastMsg: "Your order is ready for pickup!",
      time: "3h ago",
      unread: 2,
      online: true,
    },
  ];
  const [active, setActive] = useState(chats[0].name);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "doctor", text: "Good morning! How are you feeling today?" },
    {
      from: "me",
      text: "Much better, doctor. Blood pressure was 125/80 yesterday.",
    },
    {
      from: "doctor",
      text: "That's great progress! Keep monitoring daily. Your latest blood pressure readings look better!",
    },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages((m) => [...m, { from: "me", text: msg }]);
    setMsg("");
    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          {
            from: "doctor",
            text: "Thanks for letting me know! I'll review your records.",
          },
        ]),
      1200,
    );
  };

  return (
    <div className="h-[calc(100vh-180px)] flex gap-4 min-h-[500px]">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-50">
          <div className="font-bold text-gray-900 text-sm mb-3">Messages</div>
          <input
            placeholder="Search…"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-300"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((c) => (
            <button
              key={c.name}
              onClick={() => setActive(c.name)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${active === c.name ? "bg-indigo-50" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <img src={c.avatar} alt="" className="w-10 h-10 rounded-xl" />
                {c.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">
                    {c.name}
                  </span>
                  <span className="text-gray-400 text-xs">{c.time}</span>
                </div>
                <div className="text-gray-500 text-xs truncate mt-0.5">
                  {c.lastMsg}
                </div>
              </div>
              {c.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {c.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-50">
          <img
            src={chats.find((c) => c.name === active)?.avatar}
            alt=""
            className="w-9 h-9 rounded-xl"
          />
          <div>
            <div className="font-bold text-gray-900 text-sm">{active}</div>
            <div className="text-emerald-500 text-xs font-semibold">Online</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from === "me" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-50 flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-300"
          />
          <button
            onClick={send}
            className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Patient Dashboard ────────────────────────────────────────────────────
const PatientDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payModal, setPayModal] = useState<{
    open: boolean;
    amount: number;
    desc: string;
  }>({ open: false, amount: 0, desc: "" });
  const [paidToast, setPaidToast] = useState(false);

  const openPay = (amount: number, desc: string) =>
    setPayModal({ open: true, amount, desc });
  const closePay = () => setPayModal((p) => ({ ...p, open: false }));
  const onPaySuccess = () => {
    setPaidToast(true);
    setTimeout(() => setPaidToast(false), 3500);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return <OverviewPage onNavigate={setActiveMenu} onPay={openPay} />;
      case "feed":
        return <FeedPage />;
      case "saved":
        return <Saved />;  
      case "prescriptions":
        return <PrescriptionsPage onPayPharmacy={openPay} />;
      case "appointments":
        return <AppointmentsPage onPay={openPay} />;
      case "pharmacy":
        return <PharmacyPage onPay={openPay} />;
      case "payments":
        return <PaymentsPage onPay={openPay} />;
      case "messages":
        return <MessagesPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Toast */}
      {paidToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-3 animate-bounce">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-bold text-sm">Payment Successful!</span>
        </div>
      )}

      <StripeModal
        open={payModal.open}
        onClose={closePay}
        amount={payModal.amount}
        description={payModal.desc}
        onSuccess={onPaySuccess}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-50">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200">
            M
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">
            Medily
          </span>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Patient Mini */}
        <div className="px-4 py-4 mx-3 mt-3 bg-indigo-50 rounded-2xl flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=Alex+Johnson&background=4f46e5&color=fff"
            alt=""
            className="w-10 h-10 rounded-xl"
          />
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-sm truncate">
              Alex Johnson
            </div>
            <div className="text-indigo-500 text-xs font-semibold">Patient</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${activeMenu === item.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeMenu === item.id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
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
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div>
            <h2 className="font-black text-gray-900 text-lg">
              {titles[activeMenu]}
            </h2>
          </div>
          <div className="flex-1 hidden sm:block max-w-xs ml-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              <input
                placeholder="Search…"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-300 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => openPay(0, "")}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Pay Bill
          </button>
          <button
            className="relative text-gray-500 hover:text-indigo-600 transition-colors"
            onClick={() => setActiveMenu("messages")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
          </button>
          <button className="relative text-gray-500 hover:text-indigo-600 transition-colors">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
          </button>
          <img
            src="https://ui-avatars.com/api/?name=Alex+Johnson&background=4f46e5&color=fff"
            alt=""
            className="w-9 h-9 rounded-xl border-2 border-indigo-100 cursor-pointer hover:border-indigo-400 transition-colors"
          />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
