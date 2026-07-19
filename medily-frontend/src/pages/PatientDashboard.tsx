// pages/PatientDashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    PATIENT_PRESCRIPTIONS as PRESCRIPTIONS,
    ALL_PRESCRIBED_MEDS,
} from "../constants/data/mockPrescriptions";
import { APPOINTMENTS } from "../constants/data/mockAppointments";
import { AVAILABLE_DOCTORS } from "../constants/data/mockDoctors";
import { PHARMACIES } from "../constants/data/mockPharmacies";
import { INITIAL_POSTS as FEED_POSTS } from "../constants/data/mockFeed";
import {
    PATIENT_NAV_ITEMS as menuItems,
    PATIENT_PAGE_TITLES as titles,
} from "../constants/menu/sidebarMenu";
import type { PatientMenuItem as MenuItem } from "../constants/menu/sidebarMenu";
import type { FeedPost, UserData, Pharmacy, Prescription } from "../types";
import { useNotifications } from "../hooks/useNotifications";
import axios from "axios";
import { getUserId } from "../lib/auth";
import { ChatUI } from "../components/ChatUI.tsx";
import { StripePaymentModal as StripeModal } from "./StripePaymentModal.tsx";
import ProfileSettings from "./ProfileSettings";

// Stripe Modal
// interface StripeModalProps {
//     open: boolean;
//     onClose: () => void;
//     amount: number;
//     description: string;
//     onSuccess: () => void;
// }

// const StripeModal: React.FC<StripeModalProps> = ({ open, onClose, amount, description, onSuccess }) => {
//     const [cardNumber, setCardNumber] = useState("");
//     const [expiry, setExpiry] = useState("");
//     const [cvc, setCvc] = useState("");
//     const [name, setName] = useState("");
//     const [processing, setProcessing] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState("");
//
//     const formatCard = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
//     const formatExpiry = (val: string) => { const d = val.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
//
//     const handlePay = async () => {
//         if (!cardNumber || !expiry || !cvc || !name) { setError("Please fill in all fields."); return; }
//         setError("");
//         setProcessing(true);
//         await new Promise((r) => setTimeout(r, 2000));
//         setProcessing(false);
//         setSuccess(true);
//         setTimeout(() => { onSuccess(); onClose(); setSuccess(false); setCardNumber(""); setExpiry(""); setCvc(""); setName(""); }, 1500);
//     };
//
//     if (!open) return null;
//
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
//                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>
//                             </div>
//                             <div>
//                                 <div className="text-white font-bold text-sm">Secure Payment</div>
//                                 <div className="text-white/70 text-xs">Powered by Stripe</div>
//                             </div>
//                         </div>
//                         <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
//                         </button>
//                     </div>
//                     <div className="mt-4">
//                         <div className="text-white/70 text-xs uppercase tracking-wider">{description}</div>
//                         <div className="text-white text-3xl font-black mt-1">${amount}.00</div>
//                     </div>
//                 </div>
//                 <div className="px-6 py-5 space-y-4">
//                     {success ? (
//                         <div className="text-center py-8">
//                             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
//                             </div>
//                             <div className="text-gray-900 font-bold text-lg">Payment Successful!</div>
//                             <div className="text-gray-500 text-sm mt-1">Your receipt has been emailed.</div>
//                         </div>
//                     ) : (
//                         <>
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Cardholder Name</label>
//                                 <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
//                             </div>
//                             <div>
//                                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Card Number</label>
//                                 <div className="relative">
//                                     <input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all pr-12" />
//                                     <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className="w-7 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div></div>
//                                 </div>
//                             </div>
//                             <div className="flex gap-3">
//                                 <div className="flex-1">
//                                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Expiry</label>
//                                     <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">CVC</label>
//                                     <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
//                                 </div>
//                             </div>
//                             {error && <div className="text-red-500 text-xs font-medium bg-red-50 rounded-lg px-3 py-2">{error}</div>}
//                             <button onClick={handlePay} disabled={processing} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 mt-2">
//                                 {processing ? (<><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>) : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Pay ${amount}.00 Securely</>)}
//                             </button>
//                             <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
//                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
//                                 256-bit SSL encrypted · PCI DSS compliant
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// Overview Page
const OverviewPage: React.FC<{ onNavigate: (m: MenuItem) => void; onPay: (amt: number, desc: string) => void; user: UserData | null }> = ({ onNavigate, onPay, user }) => {
    const activePrescriptions = PRESCRIPTIONS.filter((p) => p.status === "active").length;
    const upcomingApts = APPOINTMENTS.filter((a) => a.status === "upcoming").length;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="relative">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Patient")}&background=ffffff&color=4f46e5&size=80`} alt="Patient" className="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1">
                        <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">Patient</div>
                        <h2 className="text-2xl font-black mt-0.5">{user?.name ?? "Patient"}</h2>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-white/80">
                            <span>Blood: O+</span>
                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                            <span>ID: PAT-2025-4821</span>
                        </div>
                    </div>
                    <div className="flex sm:flex-col gap-4 sm:gap-2 text-center">
                        <div><div className="text-3xl font-black">{activePrescriptions}</div><div className="text-white/70 text-xs">Active Rx</div></div>
                        <div className="w-px h-10 bg-white/20 hidden sm:block self-center" />
                        <div><div className="text-3xl font-black">{upcomingApts}</div><div className="text-white/70 text-xs">Upcoming</div></div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "View Prescriptions", icon: "📋", color: "from-blue-50 to-indigo-50 border-indigo-100", text: "text-indigo-600", nav: "prescriptions" as MenuItem },
                        { label: "Book Appointment", icon: "📅", color: "from-violet-50 to-purple-50 border-violet-100", text: "text-violet-600", nav: "appointments" as MenuItem },
                        { label: "Find Pharmacy", icon: "💊", color: "from-emerald-50 to-teal-50 border-emerald-100", text: "text-emerald-600", nav: "pharmacy" as MenuItem },
                        { label: "Pay Bills", icon: "💳", color: "from-amber-50 to-orange-50 border-amber-100", text: "text-amber-600", nav: "payments" as MenuItem },
                    ].map((action) => (
                        <button key={action.nav} onClick={() => onNavigate(action.nav)} className={`bg-gradient-to-br ${action.color} border rounded-2xl p-4 text-left hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95`}>
                            <div className="text-2xl mb-2">{action.icon}</div>
                            <div className={`text-sm font-bold ${action.text}`}>{action.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 text-sm">Active Prescriptions</h3>
                        <button onClick={() => onNavigate("prescriptions")} className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">View all →</button>
                    </div>
                    <div className="p-4 space-y-3">
                        {PRESCRIPTIONS.filter((p) => p.status === "active").map((rx) => (
                            <div key={rx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <img src={rx.doctorAvatar} alt="" className="w-9 h-9 rounded-xl flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900 text-sm truncate">{rx.doctor}</div>
                                    <div className="text-gray-500 text-xs">{rx.medications.length} meds · Refill {rx.nextRefill}</div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">Active</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 text-sm">Upcoming Appointments</h3>
                        <button onClick={() => onNavigate("appointments")} className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">View all →</button>
                    </div>
                    <div className="p-4 space-y-3">
                        {APPOINTMENTS.filter((a) => a.status === "upcoming").map((apt) => (
                            <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="bg-indigo-100 rounded-xl px-3 py-2 text-center flex-shrink-0">
                                    <div className="text-indigo-700 font-black text-sm">{apt.date.split(", ")[0].split(" ")[1]}</div>
                                    <div className="text-indigo-500 text-xs">{apt.date.split(" ")[0]}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900 text-sm truncate">{apt.doctor}</div>
                                    <div className="text-gray-500 text-xs">{apt.time} · {apt.type}</div>
                                </div>
                                <button onClick={() => onPay(apt.fee, `Appointment with ${apt.doctor}`)} className="text-indigo-600 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">Pay ${apt.fee}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Health Vitals (Last Reading)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Blood Pressure", value: "128/82", unit: "mmHg", icon: "❤️", status: "Borderline", color: "text-amber-600 bg-amber-50" },
                        { label: "Heart Rate", value: "72", unit: "BPM", icon: "💓", status: "Normal", color: "text-emerald-600 bg-emerald-50" },
                        { label: "Blood Sugar", value: "106", unit: "mg/dL", icon: "🩸", status: "Normal", color: "text-emerald-600 bg-emerald-50" },
                        { label: "BMI", value: "24.1", unit: "kg/m²", icon: "⚖️", status: "Healthy", color: "text-emerald-600 bg-emerald-50" },
                    ].map((v) => (
                        <div key={v.label} className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-xl mb-1.5">{v.icon}</div>
                            <div className="text-2xl font-black text-gray-900">{v.value}<span className="text-xs font-normal text-gray-400 ml-1">{v.unit}</span></div>
                            <div className="text-xs text-gray-500 mt-0.5">{v.label}</div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${v.color}`}>{v.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PrescriptionsPage: React.FC<{ onPayPharmacy: (amt: number, desc: string) => void }> = ({ onPayPharmacy }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [tab, setTab] = useState<"all" | "active" | "completed">("all");
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [sendingRxId, setSendingRxId] = useState<number | null>(null);
    const [sendSuccess, setSendSuccess] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchAll = async () => {
            try {
                const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );

                const [rxRes, phRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/prescriptions/my", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8080/api/pharmacies/nearby", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        }
                    })
                ]);

                setPrescriptions(rxRes.data.data);
                setPharmacies(phRes.data.data);
            } catch (err) {
                console.error("Failed to load data", err);
                // Fallback: if location is denied, load without sorting
                try {
                    const token = localStorage.getItem("token");
                    const rxRes = await axios.get("http://localhost:8080/api/prescriptions/my", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const phRes = await axios.get("http://localhost:8080/api/pharmacies", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPrescriptions(rxRes.data.data);
                    setPharmacies(phRes.data.data);
                } catch (fallbackErr) {
                    console.error("Fallback fetch also failed", fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleConfirmSend = async (pharmacyId: number) => {
        console.log("=== PRESCRIPTIONS PAGE ===");
        console.log("prescriptionId:", sendingRxId, "| type:", typeof sendingRxId);
        console.log("pharmacyId:", pharmacyId, "| type:", typeof pharmacyId);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/prescription-requests",
                { prescriptionId: sendingRxId, pharmacyId, note: "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSendingRxId(null);
            setSendSuccess("Request sent to pharmacy successfully!");
            setTimeout(() => setSendSuccess(null), 3000);
        } catch {
            alert("Failed to send request. Please try again.");
        }
    };

    const filtered = prescriptions.filter((p) =>
        tab === "all" ? true : p.status?.toLowerCase() === tab
    );

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Pharmacy selector modal */}
            {sendingRxId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-1">Select Pharmacy</h3>
                        <p className="text-gray-500 text-sm mb-4">Choose a pharmacy to send prescription RX-{sendingRxId}</p>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {pharmacies.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-6">No pharmacies available</p>
                            ) : pharmacies.map((ph: any, idx: number) => (
                                <button key={ph.id ?? idx}  onClick={() => {
                                    console.log("Pharmacy object:", ph); // ADD THIS
                                    handleConfirmSend(ph.id);
                                }}
                                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all text-left">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{ph.name}</div>
                                        <div className="text-gray-400 text-xs">{ph.city}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setSendingRxId(null)}
                                className="mt-4 w-full border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Success toast */}
            {sendSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="font-bold text-sm">{sendSuccess}</span>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-black text-gray-900">My Prescriptions</h1>
                <p className="text-gray-500 text-sm mt-0.5">View and manage prescriptions from your doctors</p>
            </div>
            <div className="flex gap-2">
                {(["all", "active", "completed"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${tab === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200"}`}>
                        {t}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="font-bold text-gray-900">No prescriptions found</h3>
                    <p className="text-gray-500 text-sm mt-1">Your doctor's prescriptions will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((rx) => (
                        <div key={rx.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                 onClick={() => setSelected(selected === rx.id ? null : rx.id)}>
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">👨‍⚕️</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-900">{rx.doctorName}</span>
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Active</span>
                                    </div>
                                    <div className="text-gray-500 text-xs mt-0.5">{rx.items?.length ?? 0} medications prescribed</div>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                        <span>📋 RX-{rx.id}</span>
                                        {rx.issuedDate && <span>📅 {rx.issuedDate}</span>}
                                    </div>
                                </div>
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${selected === rx.id ? "rotate-180" : ""}`}
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>

                            {selected === rx.id && (
                                <div className="border-t border-gray-50 p-5 space-y-4 bg-gray-50/50">
                                    {rx.items && rx.items.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Prescribed Medications</h4>
                                            <div className="space-y-2">
                                                {rx.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                                                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <span className="text-lg">💊</span>
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1">
                                                            <div>
                                                                <div className="text-xs text-gray-400">Medicine</div>
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {item.medicineName} <span className="text-indigo-600">{item.dosage}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-400">Frequency</div>
                                                                <div className="text-sm font-semibold text-gray-700">{item.instructions || "—"}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-400">Duration</div>
                                                                <div className="text-sm font-semibold text-gray-700">{item.duration || "—"}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-400">Ref No.</div>
                                                                <div className="text-sm font-semibold text-gray-700 font-mono">RX-{rx.id}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {rx.notes && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span>📝</span>
                                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Doctor's Notes</span>
                                            </div>
                                            <p className="text-sm text-amber-900">{rx.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 flex-wrap">
                                        <button onClick={() => setSendingRxId(rx.id)}
                                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                                            💊 Send to Pharmacy
                                        </button>
                                        <button onClick={() => onPayPharmacy((rx.items?.length ?? 1) * 25, `Medications from RX-${rx.id}`)}
                                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                                            Pay for Meds
                                        </button>
                                        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AppointmentsPage: React.FC<{ onPay: (amt: number, desc: string) => void; setPendingBooking: (booking: any) => void; setShowPayment: (show: boolean) => void; onRefreshNeeded?: (refreshFn: () => void) => void; }> = ({ onPay , setPendingBooking, setShowPayment, pendingBooking, onRefreshNeeded }) => {
    const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
    const [bookedSlot, setBookedSlot] = useState<{ [k: string]: string }>({});
    const [selectedDate, setSelectedDate] = useState<{ [k: string]: string }>({});
    const [doctors, setDoctors] = useState<any[]>([]);
    const [myAppointments, setMyAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

    const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (onRefreshNeeded) {
            onRefreshNeeded(fetchMyAppointments);
        }
    }, []);

    // Load doctors and patient's appointments on mount
    useEffect(() => {
        fetchDoctors();
        fetchMyAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/doctors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data.data);
        } catch (err) {
            console.error("Failed to load doctors");
        }
    };

    const fetchMyAppointments = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/appointments/my", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyAppointments(res.data.data);
        } catch (err) {
            console.error("Failed to load appointments");
        }
    };

    // const handleConfirmBooking = async (doctor: any) => {
    //     const time = bookedSlot[doctor.id];
    //     const date = selectedDate[doctor.id];
    //
    //     if (!time || !date) {
    //         alert("Please select a date and time slot.");
    //         return;
    //     }
    //
    //     setLoading(true);
    //     try {
    //         await axios.post("http://localhost:8080/api/appointments",
    //             {
    //                 doctorId: doctor.id,
    //                 date: date,
    //                 time: time,
    //                 notes: ""
    //             },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         setBookingSuccess(`Appointment booked with ${doctor.name}!`);
    //         setBookingDoctor(null);
    //         fetchMyAppointments(); // refresh list
    //         setTimeout(() => setBookingSuccess(null), 3000);
    //     } catch (err) {
    //         alert("Failed to book appointment. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleConfirmBooking = async (doctor: any) => {
        const time = bookedSlot[doctor.id];
        const date = selectedDate[doctor.id];

        if (!time || !date) {
            alert("Please select a date and time slot.");
            return;
        }

        // Store booking and show payment modal
        setPendingBooking({ doctor, time, date });
        setShowPayment(true);
    };

    // Add StarRating component inside AppointmentsPage:
    const StarRating: React.FC<{ appointmentId: number; doctorId: number; currentRating: number }> =
        ({ appointmentId, doctorId, currentRating }) => (
            <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(star => (
                    <button key={star}
                            onClick={() => handleRate(doctorId, appointmentId, star)}
                            className="transition-transform hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 24 24"
                             fill={star <= currentRating ? "#f59e0b" : "none"}
                             stroke={star <= currentRating ? "#f59e0b" : "#d1d5db"}
                             strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </button>
                ))}
                {ratingSuccess === appointmentId && (
                    <span className="text-xs text-emerald-600 font-bold ml-1">✓ Rated!</span>
                )}
            </div>
        );



    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">Book, manage, and track your doctor visits</p>
            </div>

            {bookingSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold">
                    ✓ {bookingSuccess}
                </div>
            )}

            {/* My Appointments from backend */}
            {myAppointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 rounded-xl px-3 py-2 text-center flex-shrink-0">
                            <div className="text-indigo-700 font-black text-sm">{apt.date}</div>
                            <div className="text-indigo-500 text-xs">{apt.time}</div>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">{apt.doctor?.name}</div>
                            <div className="text-gray-500 text-xs">{apt.doctor?.specialization}</div>
                            {/* ADD STAR RATING FOR COMPLETED */}
                            {apt.status === "COMPLETED" && (
                                <StarRating
                                    appointmentId={apt.id}
                                    doctorId={apt.doctor?.id}
                                    currentRating={ratings[apt.id] ?? 0}
                                />
                            )}
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            apt.status === "BOOKED" ? "bg-blue-100 text-blue-700" :
                                apt.status === "COMPLETED" ? "bg-gray-100 text-gray-500" :
                                    "bg-red-100 text-red-600"
                        }`}>{apt.status}</span>
                    </div>
                </div>
            ))}

            {/* Book New Appointment */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Book a New Appointment</h3>
                {doctors.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Loading doctors...</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {doctors.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=4f46e5&color=fff`} alt="" className="w-11 h-11 rounded-xl" />
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{doc.name}</div>
                                            <div className="text-gray-500 text-xs">{doc.specialization}</div>
                                        </div>
                                    </div>

                                    {bookingDoctor === doc.id ? (
                                        <div>
                                            <div className="mb-3">
                                                <label className="text-xs font-bold text-gray-500 block mb-1">Select Date</label>
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split("T")[0]}
                                                    value={selectedDate[doc.id] || ""}
                                                    onChange={e => setSelectedDate(d => ({ ...d, [doc.id]: e.target.value }))}
                                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                                />
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 mb-2">Select Time</div>
                                            <div className="grid grid-cols-3 gap-1.5 mb-3">
                                                {timeSlots.map((slot) => (
                                                    <button key={slot} onClick={() => setBookedSlot(b => ({ ...b, [doc.id]: slot }))}
                                                            className={`text-xs py-1.5 rounded-lg font-semibold transition-all ${bookedSlot[doc.id] === slot ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}>
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setBookingDoctor(null)} className="flex-1 border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded-xl">Cancel</button>
                                                <button
                                                    disabled={!bookedSlot[doc.id] || !selectedDate[doc.id] || loading}
                                                    onClick={() => handleConfirmBooking(doc)}
                                                    className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl disabled:opacity-40 hover:bg-indigo-700 transition-colors">
                                                    {loading ? "Booking..." : "Confirm"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setBookingDoctor(doc.id)} className="w-full bg-indigo-50 text-indigo-700 text-sm font-bold py-2.5 rounded-xl hover:bg-indigo-100 transition-colors">
                                            Book Appointment
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const PharmacyPage: React.FC<{  onPay: (amt: number, desc: string) => void;
    onMessagePharmacy: (pharmacyUserId: number, pharmacyName: string) => void;
}> = ({ onPay, onMessagePharmacy }) => {
    const [search, setSearch] = useState("");
    const [pharmacies, setPharmacies] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [sendingToPharmacy, setSendingToPharmacy] = useState<{ pharmacyId: number; pharmacyName: string } | null>(null);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<number | null>(null);
    const [sendSuccess, setSendSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem("token");
                const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );
                const [phRes, rxRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/pharmacies/nearby", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    }),
                    axios.get("http://localhost:8080/api/prescriptions/my", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setPharmacies(phRes.data.data);
                setPrescriptions(rxRes.data.data);
            } catch (err) {
                console.error("Location denied or fetch failed", err);
                try {
                    const token = localStorage.getItem("token");
                    const [phRes, rxRes] = await Promise.all([
                        axios.get("http://localhost:8080/api/pharmacies", {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get("http://localhost:8080/api/prescriptions/my", {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);
                    setPharmacies(phRes.data.data);
                    setPrescriptions(rxRes.data.data);
                } catch (fallbackErr) {
                    console.error("Fallback also failed", fallbackErr);
                }
            }
        };
        fetchAll();
    }, []);

    const handleConfirmSend = async () => {
        console.log("=== PHARMACY PAGE ===");
        console.log("prescriptionId:", selectedPrescriptionId, "| type:", typeof selectedPrescriptionId);
        console.log("pharmacyId:", sendingToPharmacy?.pharmacyId, "| type:", typeof sendingToPharmacy?.pharmacyId);

        if (!sendingToPharmacy || !selectedPrescriptionId) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/prescription-requests",
                { prescriptionId: selectedPrescriptionId, pharmacyId: sendingToPharmacy.pharmacyId, note: "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSendingToPharmacy(null);
            setSelectedPrescriptionId(null);
            setSendSuccess(`Request sent to ${sendingToPharmacy.pharmacyName}!`);
            setTimeout(() => setSendSuccess(null), 3000);
        } catch {
            alert("Failed to send request. Please try again.");
        }
    };

    return (
        <div className="space-y-5">

            {/* Prescription selector modal */}
            {sendingToPharmacy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-1">Select Prescription</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Sending to <span className="font-bold text-gray-700">{sendingToPharmacy.pharmacyName}</span>
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                            {prescriptions.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-6">No prescriptions available</p>
                            ) : prescriptions.map((rx) => (
                                <div key={rx.id} className={`rounded-xl border transition-all ${
                                    selectedPrescriptionId === rx.id
                                        ? "border-indigo-400 bg-indigo-50"
                                        : "border-gray-100 bg-gray-50 hover:border-indigo-200"
                                }`}>
                                    {/* Prescription header — click to select */}
                                    <button
                                        onClick={() => setSelectedPrescriptionId(rx.id)}
                                        className="w-full text-left p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">RX-{rx.id}</div>
                                                <div className="text-gray-400 text-xs mt-0.5">
                                                    {rx.doctorName} · {rx.issuedDate}
                                                </div>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                                selectedPrescriptionId === rx.id
                                                    ? "border-indigo-500 bg-indigo-500"
                                                    : "border-gray-300"
                                            }`}>
                                                {selectedPrescriptionId === rx.id && (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Medications dropdown — always visible */}
                                        {rx.items && rx.items.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {rx.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1.5 border border-gray-100">
                                                        <span className="text-sm">💊</span>
                                                        <span className="text-xs font-semibold text-gray-700">{item.medicineName}</span>
                                                        <span className="text-xs text-indigo-500 font-medium">{item.dosage}</span>
                                                        {item.duration && (
                                                            <span className="text-xs text-gray-400 ml-auto">{item.duration}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            disabled={!selectedPrescriptionId}
                            onClick={handleConfirmSend}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 mb-2">
                            Send to Pharmacy
                        </button>
                        <button
                            onClick={() => { setSendingToPharmacy(null); setSelectedPrescriptionId(null); }}
                            className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Success toast */}
            {sendSuccess && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                    <span>✓</span><span className="font-bold text-sm">{sendSuccess}</span>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-black text-gray-900">Find Pharmacy</h1>
                <p className="text-gray-500 text-sm mt-0.5">Browse nearby pharmacies and send your prescription</p>
            </div>

            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pharmacies by name or area…" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white transition-all" />
            </div>

            <div className="space-y-4">
                {pharmacies
                    .filter((ph) => !search || ph.name.toLowerCase().includes(search.toLowerCase()) || ph.city?.toLowerCase().includes(search.toLowerCase()))
                    .map((ph, idx) => (
                        <div key={ph.id ?? idx} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${idx === 0 ? "border-indigo-200 ring-1 ring-indigo-100" : "border-gray-100"}`}>
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl bg-gray-100">🏥</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-gray-900">{ph.name}</span>
                                            {idx === 0 && <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Closest</span>}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">📍 {ph.city}</div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                            {ph.distanceKm && <span>📏 {ph.distanceKm.toFixed(1)} km</span>}
                                            {ph.avgResponseMinutes && <span>⏱ ~{ph.avgResponseMinutes} min</span>}
                                            <span>📞 {ph.contactNumber}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setSendingToPharmacy({ pharmacyId: ph.id, pharmacyName: ph.name })}
                                        className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                                        💊 Send Prescription
                                    </button>
                                    <button
                                        onClick={() => onMessagePharmacy(ph.userIdOfPharmacist, ph.name)}
                                        className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                                        💬 Message
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

const PaymentsPage: React.FC<{ onPay: (amt: number, desc: string) => void }> = ({ onPay }) => {
    const transactions = [
        { id: "TXN-001", desc: "Appointment – Dr. Sarah Mitchell", amount: 150, date: "Feb 10, 2025", status: "paid", method: "Visa •• 4242" },
        { id: "TXN-002", desc: "Medications – MedPlus Pharmacy", amount: 87, date: "Feb 10, 2025", status: "paid", method: "Visa •• 4242" },
        { id: "TXN-003", desc: "Appointment – Dr. James Okafor", amount: 200, date: "Jan 28, 2025", status: "paid", method: "Mastercard •• 5555" },
        { id: "TXN-004", desc: "Medications – CityHealth Drugstore", amount: 54, date: "Jan 28, 2025", status: "paid", method: "Mastercard •• 5555" },
    ];
    const pending = [
        { desc: "Appointment – Dr. Sarah Mitchell", amount: 150, date: "Feb 20, 2025", id: "apt1" },
        { desc: "Appointment – Dr. James Okafor", amount: 200, date: "Feb 25, 2025", id: "apt2" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Payments & Billing</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your medical bills and payment history</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[{ label: "Total Spent", value: "$491", icon: "💳", color: "text-indigo-600 bg-indigo-50" }, { label: "Pending Bills", value: "$350", icon: "⏳", color: "text-amber-600 bg-amber-50" }, { label: "This Month", value: "$237", icon: "📅", color: "text-emerald-600 bg-emerald-50" }].map((s) => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-4`}><div className="text-2xl mb-1">{s.icon}</div><div className={`text-2xl font-black ${s.color.split(" ")[0]}`}>{s.value}</div><div className="text-xs font-medium opacity-70 mt-0.5">{s.label}</div></div>
                ))}
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Payments</h3>
                <div className="space-y-3">
                    {pending.map((p) => (
                        <div key={p.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⏳</div>
                            <div className="flex-1"><div className="font-bold text-gray-900 text-sm">{p.desc}</div><div className="text-gray-500 text-xs">Due: {p.date}</div></div>
                            <div className="text-right"><div className="font-black text-gray-900">${p.amount}</div><button onClick={() => onPay(p.amount, p.desc)} className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg mt-1 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">Pay Now</button></div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment History</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {transactions.map((txn, i) => (
                        <div key={txn.id} className={`flex items-center gap-4 p-4 ${i < transactions.length - 1 ? "border-b border-gray-50" : ""}`}>
                            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg></div>
                            <div className="flex-1 min-w-0"><div className="font-semibold text-gray-900 text-sm truncate">{txn.desc}</div><div className="text-gray-400 text-xs">{txn.date} · {txn.method}</div></div>
                            <div className="text-right flex-shrink-0"><div className="font-black text-gray-900">${txn.amount}</div><span className="text-xs text-emerald-600 font-bold">Paid</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FeedPage: React.FC = () => {
    const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);
    const cats = ["All", "Heart Health", "Nutrition", "Mental Health", "Research"];
    const [cat, setCat] = useState("All");
    const toggleLike = (id: number) => setPosts((ps) => ps.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    const toggleBookmark = (id: number) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));
    const filtered = posts.filter((p) => cat === "All" || p.category === cat);

    return (
        <div className="space-y-5">
            <div><h1 className="text-2xl font-black text-gray-900">Medical Feed</h1><p className="text-gray-500 text-sm mt-0.5">Health updates curated for your conditions</p></div>
            <div className="flex gap-2 flex-wrap">
                {cats.map((c) => (<button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${cat === c ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200"}`}>{c}</button>))}
            </div>
            <div className="space-y-4">
                {filtered.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover" />}
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                <div className="flex-1"><div className="font-bold text-gray-900 text-sm">{post.author.name}</div><div className="text-gray-400 text-xs">{post.author.specialty} · {post.time}</div></div>
                                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">{post.category}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${post.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                                    {post.likes}
                                </button>
                                <div className="flex-1" />
                                <button onClick={() => toggleBookmark(post.id)} className={`transition-colors ${post.bookmarked ? "text-amber-500" : "text-gray-400 hover:text-amber-400"}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill={post.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MessagesPage: React.FC<{ userId: number | null; userName: string }> = ({ userId, userName }) => {
    return <ChatUI userId={userId} userRole="PATIENT" userName={userName} />;
};

// ── Main Patient Dashboard ──────────────────────────────────────────────────
const PatientDashboard: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [payModal, setPayModal] = useState<{ open: boolean; amount: number; desc: string }>({ open: false, amount: 0, desc: "" });
    const [paidToast, setPaidToast] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userId, setUserId] = useState<number | null>(null);
    const [chatTargetParticipantId, setChatTargetParticipantId] = useState<number | null>(null);
    // Inside PatientDashboard component
    const [showPayment, setShowPayment] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<{ doctor: any; time: string; date: string } | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [showProfile, setShowProfile] = useState(false);

    // 2. Pass the state userId to the hook
    const { notifications, unreadCount, markAllRead } = useNotifications(userId);

    const [showNotifications, setShowNotifications] = useState(false);

    // ── FIXED: Read from correct localStorage keys ──
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");
        const storedUserId = localStorage.getItem("userId");

        if (token && role === "PATIENT") {
            setUser({ name: name ?? "Patient", role: role, email: "", isAuthenticated: true });
            if (storedUserId) setUserId(parseInt(storedUserId));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const openPay = (amount: number, desc: string) => setPayModal({ open: true, amount, desc });
    const closePay = () => setPayModal((p) => ({ ...p, open: false }));
    const onPaySuccess = () => { setPaidToast(true); setTimeout(() => setPaidToast(false), 3500); };

    const fetchMyAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/appointments/my", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // If you have a state for appointments in the parent, set it here
            // setMyAppointments(res.data.data);
        } catch (err) {
            console.error("Failed to refresh appointments", err);
        }
    };

    const handleMessagePharmacy = async (pharmacistUserId: number) => {
        if (!userId) return;
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost:8080/api/chat/rooms",
                { patientId: userId, participantId: pharmacistUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChatTargetParticipantId(pharmacistUserId);
            setActiveMenu("messages");
        } catch (err) {
            console.error("Failed to start chat", err);
        }
    };

    const handlePaymentSuccess = async () => {
        if (!pendingBooking) return;
        const { doctor, time, date } = pendingBooking;

        // Debug: see exactly what's being sent
        console.log("Booking payload:", {
            doctorId: doctor.id,
            date,
            time,
            notes: ""
        });
        console.log("Full doctor object:", doctor);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:8080/api/appointments",
                {
                    doctorId: doctor.id,   // <-- verify this field exists
                    date,
                    time,
                    notes: ""
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Booking response:", res.data);

            setBookingSuccess(`Appointment booked with ${doctor.name}!`);
            setShowPayment(false);
            setPendingBooking(null);
            fetchMyAppointments();
            setTimeout(() => setBookingSuccess(null), 3000);
        } catch (err: any) {
            console.error("Booking failed - full error:", err.response?.data);
            alert(`Booking failed: ${JSON.stringify(err.response?.data)}`);
        }
    }

// Add this state inside AppointmentsPage:
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [ratingSuccess, setRatingSuccess] = useState<number | null>(null);

    const handleRate = async (doctorId: number, appointmentId: number, stars: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/ratings",
                { doctorId, appointmentId, stars },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatings(r => ({ ...r, [appointmentId]: stars }));
            setRatingSuccess(appointmentId);
            setTimeout(() => setRatingSuccess(null), 2000);
        } catch {
            // silently fail for demo
            setRatings(r => ({ ...r, [appointmentId]: stars }));
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "overview": return <OverviewPage onNavigate={setActiveMenu} onPay={openPay} user={user} />;
            case "feed": return <FeedPage />;
            case "saved": return <div className="text-center py-20 text-gray-400 font-semibold">No saved items yet.</div>;
            case "prescriptions": return <PrescriptionsPage onPayPharmacy={openPay} />;
            case "appointments":
                return (
                    <AppointmentsPage
                        onPay={openPay}
                        setPendingBooking={setPendingBooking}
                        setShowPayment={setShowPayment}
                        pendingBooking={pendingBooking}
                    />
                );
            case "messages": return (
                <ChatUI
                    userId={userId}
                    userRole="PATIENT"
                    userName={user?.name ?? "Patient"}
                    initialRoomParticipantId={chatTargetParticipantId ?? undefined}
                />
            );
            case "payments": return <PaymentsPage onPay={openPay} />;
            default: return null;
        }
    };

    if (!user)
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {showProfile && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                    <ProfileSettings onClose={() => setShowProfile(false)} />
                </div>
            )}

            {paidToast && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="font-bold text-sm">Payment Successful!</span>
                </div>
            )}

            <StripeModal
                open={payModal.open || showPayment} // Opens for general "Pay Bill" OR new bookings
                onClose={() => { closePay(); setShowPayment(false); }}
                amount={showPayment ? 50 : payModal.amount} // Example: $50 for a new booking
                description={showPayment ? `Appointment with ${pendingBooking?.doctor?.name}` : payModal.desc}
                endpoint="/api/payments/appointment/create-intent"
                onSuccess={() => {
                    if (showPayment) {
                        handlePaymentSuccess(); // This actually saves the booking to the DB
                    } else {
                        onPaySuccess(); // Standard bill payment
                    }
                }}
            />

            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shadow-none`}>
                <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-50">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200">M</div>
                    <span className="font-black text-gray-900 text-lg tracking-tight">Medily</span>
                    <button className="ml-auto lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="px-4 py-4 mx-3 mt-3 bg-indigo-50 rounded-2xl flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Patient")}&background=4f46e5&color=fff`} alt="" className="w-10 h-10 rounded-xl" />
                    <div className="min-w-0"><div className="font-bold text-gray-900 text-sm truncate">{user?.name ?? "Patient"}</div><div className="text-indigo-500 text-xs font-semibold">Patient</div></div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button key={item.id} onClick={() => { setActiveMenu(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${activeMenu === item.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            <span className="text-base">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeMenu === item.id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>{item.badge}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-50">
                    {/* FIXED: logout now calls the function correctly */}
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>
                    <div><h2 className="font-black text-gray-900 text-lg">{titles[activeMenu]}</h2></div>
                    <div className="flex-1 hidden sm:block max-w-xs ml-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                            <input placeholder="Search…" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-300 focus:bg-white transition-all" />
                        </div>
                    </div>
                    <div className="flex-1" />
                    <button onClick={() => openPay(0, "")} className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">Pay Bill</button>
                    {/* Messages button */}
                    <button className="relative text-gray-500 hover:text-indigo-600 transition-colors" onClick={() => setActiveMenu("messages")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    </button>

                    {/* Notification bell */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
                            className="relative text-gray-500 hover:text-indigo-600 transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 01-3.46 0"/>
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
            </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                                    <span className="font-bold text-gray-900 text-sm">Notifications</span>
                                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-gray-400 text-sm">No notifications yet</div>
                                    ) : notifications.map((n) => (
                                        <div key={n.notificationId} className={`px-4 py-3 border-b border-gray-50 ${!n.isRead ? "bg-indigo-50" : ""}`}>
                                            <p className="text-sm text-gray-800">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "Patient")}&background=4f46e5&color=fff`}
                        alt=""
                        onClick={() => setShowProfile(true)}
                        className="w-9 h-9 rounded-xl border-2 border-indigo-100 cursor-pointer hover:border-indigo-400 transition-colors"
                    />
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">{renderContent()}</div>
                </main>
            </div>
        </div>
);
};

export default PatientDashboard;