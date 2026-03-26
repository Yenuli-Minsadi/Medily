import { useState } from "react";

// Types
// type Role = "admin" | "doctor" | "patient" | "pharmacy";
type Tab = "overview" | "doctors" | "patients" | "pharmacies" | "prescriptions" | "appointments" | "analytics" | "settings";

interface StatCard { label: string; value: string | number; delta?: string; positive?: boolean; icon: string; color: string; }
interface User { id: string; name: string; role: string; status: "active" | "inactive" | "pending"; joined: string; avatar: string; }
interface PrescriptionRequest { id: string; patient: string; doctor: string; pharmacy: string; drug: string; status: "pending" | "accepted" | "dispensed" | "rejected"; date: string; }
interface Appointment { id: string; patient: string; doctor: string; specialty: string; date: string; time: string; status: "confirmed" | "pending" | "cancelled"; }

// Mock data
const STATS: StatCard[] = [
    { label: "Total Doctors", value: 148, delta: "+12 this month", positive: true, icon: "🩺", color: "from-violet-500 to-indigo-600" },
    { label: "Active Patients", value: "3,842", delta: "+284 this week", positive: true, icon: "👥", color: "from-sky-500 to-cyan-600" },
    { label: "Pharmacies", value: 37, delta: "+3 new", positive: true, icon: "💊", color: "from-emerald-500 to-teal-600" },
    { label: "Pending Rx Requests", value: 94, delta: "12 urgent", positive: false, icon: "📋", color: "from-amber-500 to-orange-600" },
    { label: "Today's Appointments", value: 312, delta: "+33% vs yesterday", positive: true, icon: "📅", color: "from-rose-500 to-pink-600" },
    { label: "Avg Platform Rating", value: "4.8 ★", delta: "↑ 0.2 pts", positive: true, icon: "⭐", color: "from-purple-500 to-violet-600" },
];

const DOCTORS: User[] = [
    { id: "D001", name: "Dr. Sarah Mitchell", role: "Cardiologist", status: "active", joined: "Jan 2023", avatar: "SM" },
    { id: "D002", name: "Dr. James Okafor", role: "Neurologist", status: "active", joined: "Mar 2023", avatar: "JO" },
    { id: "D003", name: "Dr. Priya Sharma", role: "Pediatrician", status: "pending", joined: "Feb 2024", avatar: "PS" },
    { id: "D004", name: "Dr. Marcus Lee", role: "Dermatologist", status: "active", joined: "Jun 2022", avatar: "ML" },
    { id: "D005", name: "Dr. Aisha Patel", role: "Oncologist", status: "inactive", joined: "Oct 2021", avatar: "AP" },
];

const PATIENTS: User[] = [
    { id: "P001", name: "Alex Johnson", role: "Patient", status: "active", joined: "Mar 2025", avatar: "AJ" },
    { id: "P002", name: "Emma Wilson", role: "Patient", status: "active", joined: "Jan 2025", avatar: "EW" },
    { id: "P003", name: "David Brown", role: "Patient", status: "pending", joined: "Feb 2025", avatar: "DB" },
    { id: "P004", name: "Lisa Garcia", role: "Patient", status: "active", joined: "Nov 2024", avatar: "LG" },
    { id: "P005", name: "Chris Taylor", role: "Patient", status: "inactive", joined: "Sep 2024", avatar: "CT" },
];

const PHARMACIES: (User & { rxPending: number; location: string })[] = [
    { id: "PH001", name: "MedPlus Central", role: "Pharmacy", status: "active", joined: "2022", avatar: "MC", rxPending: 18, location: "Downtown" },
    { id: "PH002", name: "HealthCare Hub", role: "Pharmacy", status: "active", joined: "2021", avatar: "HH", rxPending: 7, location: "Westside" },
    { id: "PH003", name: "QuickMeds Online", role: "Pharmacy", status: "pending", joined: "2025", avatar: "QM", rxPending: 0, location: "Online" },
    { id: "PH004", name: "CityPharm Network", role: "Pharmacy", status: "active", joined: "2020", avatar: "CP", rxPending: 23, location: "Eastside" },
];

const PRESCRIPTIONS: PrescriptionRequest[] = [
    { id: "RX-2025-001", patient: "Alex Johnson", doctor: "Dr. Sarah Mitchell", pharmacy: "MedPlus Central", drug: "Atorvastatin 40mg", status: "pending", date: "Mar 26, 2025" },
    { id: "RX-2025-002", patient: "Lisa Garcia", doctor: "Dr. James Okafor", pharmacy: "HealthCare Hub", drug: "Lisinopril 10mg", status: "accepted", date: "Mar 25, 2025" },
    { id: "RX-2025-003", patient: "Emma Wilson", doctor: "Dr. Sarah Mitchell", pharmacy: "CityPharm Network", drug: "Metformin 500mg", status: "dispensed", date: "Mar 24, 2025" },
    { id: "RX-2025-004", patient: "David Brown", doctor: "Dr. Priya Sharma", pharmacy: "MedPlus Central", drug: "Amoxicillin 250mg", status: "pending", date: "Mar 26, 2025" },
    { id: "RX-2025-005", patient: "Chris Taylor", doctor: "Dr. Marcus Lee", pharmacy: "HealthCare Hub", drug: "Tretinoin 0.05%", status: "rejected", date: "Mar 23, 2025" },
    { id: "RX-2025-006", patient: "Alex Johnson", doctor: "Dr. James Okafor", pharmacy: "QuickMeds Online", drug: "Sertraline 50mg", status: "pending", date: "Mar 26, 2025" },
];

const APPOINTMENTS: Appointment[] = [
    { id: "APT-001", patient: "Alex Johnson", doctor: "Dr. Sarah Mitchell", specialty: "Cardiology", date: "Feb 20", time: "10:00 AM", status: "confirmed" },
    { id: "APT-002", patient: "Emma Wilson", doctor: "Dr. Priya Sharma", specialty: "Pediatrics", date: "Feb 21", time: "2:30 PM", status: "pending" },
    { id: "APT-003", patient: "David Brown", doctor: "Dr. James Okafor", specialty: "Neurology", date: "Feb 22", time: "11:00 AM", status: "confirmed" },
    { id: "APT-004", patient: "Lisa Garcia", doctor: "Dr. Marcus Lee", specialty: "Dermatology", date: "Feb 23", time: "9:00 AM", status: "cancelled" },
    { id: "APT-005", patient: "Chris Taylor", doctor: "Dr. Sarah Mitchell", specialty: "Cardiology", date: "Feb 24", time: "3:00 PM", status: "confirmed" },
];

// Component helpers
const Avatar = ({ initials, color = "bg-violet-600" }: { initials: string; color?: string }) => (
    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{initials}</div>
);

const Badge = ({ status }: { status: string }) => {
    const map: Record<string, string> = {
        active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        inactive: "bg-slate-100 text-slate-500 border border-slate-200",
        pending: "bg-amber-100 text-amber-700 border border-amber-200",
        confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        cancelled: "bg-red-100 text-red-600 border border-red-200",
        accepted: "bg-blue-100 text-blue-700 border border-blue-200",
        dispensed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        rejected: "bg-red-100 text-red-600 border border-red-200",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-gray-100 text-gray-500"}`}>{status}</span>
    );
};

const avatarColors = ["bg-violet-600", "bg-sky-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-indigo-600"];
const getColor = (s: string) => avatarColors[s.charCodeAt(0) % avatarColors.length];

// Mini bar chart (pure CSS)
const MiniBarChart = () => {
    const data = [40, 65, 50, 80, 72, 90, 85, 95, 78, 88, 75, 100];
    const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    return (
        <div className="flex items-end gap-1.5 h-24 pt-2">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t-sm transition-all duration-500"
                        style={{ height: `${v}%`, background: i === data.length - 1 ? "linear-gradient(180deg,#7c3aed,#4f46e5)" : "rgba(124,58,237,0.25)" }}
                    />
                    {i % 3 === 0 && <span className="text-[9px] text-slate-400">{labels[i]}</span>}
                </div>
            ))}
        </div>
    );
};

// Donut chart (SVG)
const DonutChart = () => {
    const segments = [
        { pct: 38, color: "#7c3aed", label: "Cardiology" },
        { pct: 22, color: "#0ea5e9", label: "Neurology" },
        { pct: 18, color: "#10b981", label: "Pediatrics" },
        { pct: 12, color: "#f59e0b", label: "Dermatology" },
        { pct: 10, color: "#ef4444", label: "Oncology" },
    ];
    const r = 38; const cx = 50; const cy = 50;
    let offset = 0;
    const arcs = segments.map(s => {
        const start = offset;
        offset += s.pct;
        return { ...s, start };
    });
    const arc = (start: number, pct: number) => {
        const startAngle = (start / 100) * 360 - 90;
        const endAngle = ((start + pct) / 100) * 360 - 90;
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
        const large = pct > 50 ? 1 : 0;
        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    };
    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
                {arcs.map((s, i) => <path key={i} d={arc(s.start, s.pct)} fill={s.color} opacity={0.9} />)}
                <circle cx={cx} cy={cy} r={22} fill="white" />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e1b4b">3,842</text>
                <text x={cx} y={cy + 7} textAnchor="middle" fontSize="5" fill="#6b7280">patients</text>
            </svg>
            <div className="flex flex-col gap-1.5">
                {segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                        <span className="text-slate-600">{s.label}</span>
                        <span className="ml-auto font-semibold text-slate-800">{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Sidebar
const NAV: { icon: string; label: string; tab: Tab; badge?: number }[] = [
    { icon: "⊞", label: "Overview", tab: "overview" },
    { icon: "🩺", label: "Doctors", tab: "doctors" },
    { icon: "👥", label: "Patients", tab: "patients" },
    { icon: "💊", label: "Pharmacies", tab: "pharmacies" },
    { icon: "📋", label: "Prescriptions", tab: "prescriptions", badge: 94 },
    { icon: "📅", label: "Appointments", tab: "appointments" },
    { icon: "📊", label: "Analytics", tab: "analytics" },
    { icon: "⚙️", label: "Settings", tab: "settings" },
];

// Main Dashboard
export default function MedilyAdmin() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [search, setSearch] = useState("");
    const [rxFilter, setRxFilter] = useState<"all" | "pending" | "accepted" | "dispensed" | "rejected">("all");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const filteredPrescriptions = PRESCRIPTIONS.filter(p =>
        (rxFilter === "all" || p.status === rxFilter) &&
        (p.patient.toLowerCase().includes(search.toLowerCase()) ||
            p.doctor.toLowerCase().includes(search.toLowerCase()) ||
            p.drug.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-white border-r border-slate-100 flex flex-col transition-all duration-300 shrink-0 shadow-sm z-10`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">M</div>
                    {sidebarOpen && <span className="font-black text-slate-800 text-lg tracking-tight">Medily</span>}
                    <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto text-slate-400 hover:text-slate-600 text-xs">
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>

                {/* Admin badge */}
                {sidebarOpen && (
                    <div className="mx-3 mt-3 p-3 bg-violet-50 rounded-xl border border-violet-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">AD</div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Admin Panel</p>
                            <p className="text-[10px] text-slate-400">Super Administrator</p>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                    {NAV.map(n => (
                        <button
                            key={n.tab}
                            onClick={() => setActiveTab(n.tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${activeTab === n.tab ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                        >
                            <span className="text-base shrink-0">{n.icon}</span>
                            {sidebarOpen && (
                                <>
                                    <span className="text-sm font-medium flex-1">{n.label}</span>
                                    {n.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === n.tab ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>{n.badge}</span>}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                {sidebarOpen && (
                    <div className="p-3 border-t border-slate-100">
                        <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl text-white">
                            <p className="text-xs font-bold mb-1">Platform Health</p>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] opacity-80">Uptime</span>
                                <span className="text-xs font-bold">99.9%</span>
                            </div>
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: "99.9%" }} />
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shrink-0">
                    <div>
                        <h1 className="text-lg font-black text-slate-800 capitalize">{activeTab === "overview" ? "Admin Dashboard" : activeTab}</h1>
                        <p className="text-xs text-slate-400">Thu, March 26, 2026 · Super Admin</p>
                    </div>
                    <div className="flex-1 max-w-md mx-auto">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search across platform…"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button className="relative p-2 hover:bg-slate-50 rounded-xl">
                            <span className="text-slate-500">🔔</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <button className="relative p-2 hover:bg-slate-50 rounded-xl">
                            <span className="text-slate-500">💬</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Overview */}
                    {activeTab === "overview" && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {STATS.map((s, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg shadow-sm`}>{s.icon}</div>
                                            {s.delta && (
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {s.delta}
                        </span>
                                            )}
                                        </div>
                                        <p className="text-2xl font-black text-slate-800">{s.value}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-black text-slate-800">Appointment Volume</p>
                                            <p className="text-xs text-slate-400">Last 12 months</p>
                                        </div>
                                        <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full border border-violet-100">+27% YoY</span>
                                    </div>
                                    <MiniBarChart />
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-black text-slate-800">Patient Distribution</p>
                                            <p className="text-xs text-slate-400">By specialty</p>
                                        </div>
                                    </div>
                                    <DonutChart />
                                </div>
                            </div>

                            {/* Recent activity + Rx pipeline */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                        <p className="font-black text-slate-800">Recent Prescriptions</p>
                                        <button className="text-xs text-violet-600 font-semibold hover:underline" onClick={() => setActiveTab("prescriptions")}>View all →</button>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {PRESCRIPTIONS.slice(0, 4).map(rx => (
                                            <div key={rx.id} className="px-5 py-3 flex items-center gap-3">
                                                <Avatar initials={rx.patient.split(" ").map(n => n[0]).join("")} color={getColor(rx.patient)} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{rx.patient}</p>
                                                    <p className="text-xs text-slate-400 truncate">{rx.drug} · {rx.pharmacy}</p>
                                                </div>
                                                <Badge status={rx.status} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                        <p className="font-black text-slate-800">Today's Appointments</p>
                                        <button className="text-xs text-violet-600 font-semibold hover:underline" onClick={() => setActiveTab("appointments")}>View all →</button>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {APPOINTMENTS.slice(0, 4).map(apt => (
                                            <div key={apt.id} className="px-5 py-3 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex flex-col items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-bold text-violet-600">{apt.date.split(" ")[0]}</span>
                                                    <span className="text-[10px] text-violet-400">{apt.date.split(" ")[1]}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{apt.patient}</p>
                                                    <p className="text-xs text-slate-400 truncate">{apt.doctor} · {apt.time}</p>
                                                </div>
                                                <Badge status={apt.status} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Portal snapshot */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Doctor Portal", icon: "🩺", desc: "148 active doctors, 4.9 avg rating", color: "from-violet-500 to-indigo-600", action: "doctors" as Tab },
                                    { label: "Patient Portal", icon: "👤", desc: "3,842 patients, 312 appts today", color: "from-sky-500 to-cyan-600", action: "patients" as Tab },
                                    { label: "Pharmacy Portal", icon: "💊", desc: "37 pharmacies, 94 pending Rx", color: "from-emerald-500 to-teal-600", action: "pharmacies" as Tab },
                                ].map((p, i) => (
                                    <button key={i} onClick={() => setActiveTab(p.action)}
                                            className={`text-left p-5 rounded-2xl bg-gradient-to-br ${p.color} text-white shadow-md hover:shadow-lg transition-shadow`}>
                                        <div className="text-3xl mb-3">{p.icon}</div>
                                        <p className="font-black text-base mb-1">{p.label}</p>
                                        <p className="text-xs opacity-80">{p.desc}</p>
                                        <div className="mt-3 text-xs font-semibold opacity-90">Manage →</div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Doctors */}
                    {activeTab === "doctors" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Doctors</h2>
                                    <p className="text-sm text-slate-400">148 registered doctors on the platform</p>
                                </div>
                                <button className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm">+ Invite Doctor</button>
                            </div>

                            {/* Summary cards */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Total", value: 148, color: "bg-violet-50 border-violet-100 text-violet-700" },
                                    { label: "Active", value: 134, color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                                    { label: "Pending Approval", value: 9, color: "bg-amber-50 border-amber-100 text-amber-700" },
                                    { label: "Inactive", value: 5, color: "bg-slate-50 border-slate-200 text-slate-500" },
                                ].map((c, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${c.color}`}>
                                        <p className="text-2xl font-black">{c.value}</p>
                                        <p className="text-xs font-semibold mt-0.5 opacity-70">{c.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-3">
                                    <input placeholder="Search doctors…" className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300" />
                                    <select className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none">
                                        <option>All Specialties</option>
                                        <option>Cardiology</option>
                                        <option>Neurology</option>
                                        <option>Pediatrics</option>
                                    </select>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {["Doctor", "Specialty", "Medical ID", "Status", "Joined", "Actions"].map(h => (
                                            <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {DOCTORS.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar initials={d.avatar} color={getColor(d.name)} />
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                                                        <p className="text-xs text-slate-400">{d.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{d.role}</td>
                                            <td className="px-5 py-3.5 text-sm font-mono text-slate-500">DOC-2024-{d.id.slice(1)}</td>
                                            <td className="px-5 py-3.5"><Badge status={d.status} /></td>
                                            <td className="px-5 py-3.5 text-sm text-slate-500">{d.joined}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-2">
                                                    <button className="text-xs text-violet-600 font-semibold hover:underline">View</button>
                                                    {d.status === "pending" && <button className="text-xs text-emerald-600 font-semibold hover:underline">Approve</button>}
                                                    <button className="text-xs text-red-400 font-semibold hover:underline">Suspend</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Patients */}
                    {activeTab === "patients" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Patients</h2>
                                    <p className="text-sm text-slate-400">3,842 registered patients</p>
                                </div>
                                <button className="px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-sm">+ Add Patient</button>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Total", value: "3,842", color: "bg-sky-50 border-sky-100 text-sky-700" },
                                    { label: "Active", value: "3,609", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                                    { label: "New This Month", value: 284, color: "bg-violet-50 border-violet-100 text-violet-700" },
                                    { label: "Inactive", value: 149, color: "bg-slate-50 border-slate-200 text-slate-500" },
                                ].map((c, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${c.color}`}>
                                        <p className="text-2xl font-black">{c.value}</p>
                                        <p className="text-xs font-semibold mt-0.5 opacity-70">{c.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {["Patient", "Patient ID", "Blood Type", "Active Rx", "Status", "Joined", "Actions"].map(h => (
                                            <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {PATIENTS.map((p, i) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar initials={p.avatar} color={getColor(p.name)} />
                                                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-mono text-slate-500">PAT-2025-{i + 4821}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{["O+", "A-", "B+", "AB+", "O-"][i]}</td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{[2, 1, 3, 1, 0][i]}</td>
                                            <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                                            <td className="px-5 py-3.5 text-sm text-slate-500">{p.joined}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-2">
                                                    <button className="text-xs text-violet-600 font-semibold hover:underline">View</button>
                                                    <button className="text-xs text-red-400 font-semibold hover:underline">Suspend</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pharmacies */}
                    {activeTab === "pharmacies" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Pharmacies</h2>
                                    <p className="text-sm text-slate-400">37 pharmacies accepting prescriptions</p>
                                </div>
                                <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">+ Onboard Pharmacy</button>
                            </div>

                            {/* Pharmacy cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {PHARMACIES.map(ph => (
                                    <div key={ph.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${getColor(ph.name)}`}>{ph.avatar}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-slate-800">{ph.name}</p>
                                                    <Badge status={ph.status} />
                                                </div>
                                                <p className="text-xs text-slate-400">📍 {ph.location} · Since {ph.joined}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <p className="text-lg font-black text-slate-800">{ph.rxPending}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Pending Rx</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <p className="text-lg font-black text-emerald-600">148</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Dispensed</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <p className="text-lg font-black text-slate-800">4.7★</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Rating</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button className="flex-1 text-xs py-2 bg-violet-50 text-violet-600 font-semibold rounded-lg hover:bg-violet-100 transition-colors border border-violet-100">View Profile</button>
                                            {ph.status === "pending" && (
                                                <button className="flex-1 text-xs py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Approve</button>
                                            )}
                                            {ph.rxPending > 0 && (
                                                <button className="flex-1 text-xs py-2 bg-amber-50 text-amber-600 font-semibold rounded-lg hover:bg-amber-100 transition-colors border border-amber-100">
                                                    {ph.rxPending} Pending
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Rx pipeline for pharmacies */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50">
                                    <p className="font-black text-slate-800">Prescription Request Pipeline</p>
                                    <p className="text-xs text-slate-400">Cross-pharmacy view of all pending requests</p>
                                </div>
                                <div className="grid grid-cols-4 divide-x divide-slate-100">
                                    {[
                                        { label: "Incoming", count: 48, color: "text-amber-600 bg-amber-50", icon: "📥" },
                                        { label: "Accepted", count: 31, color: "text-blue-600 bg-blue-50", icon: "✅" },
                                        { label: "Dispensed", count: 186, color: "text-emerald-600 bg-emerald-50", icon: "💊" },
                                        { label: "Rejected", count: 15, color: "text-red-600 bg-red-50", icon: "❌" },
                                    ].map((s, i) => (
                                        <div key={i} className="p-5 text-center">
                                            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg mx-auto mb-3`}>{s.icon}</div>
                                            <p className="text-3xl font-black text-slate-800">{s.count}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Prescriptions */}
                    {activeTab === "prescriptions" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Prescriptions</h2>
                                    <p className="text-sm text-slate-400">All prescription requests across pharmacies</p>
                                </div>
                            </div>

                            {/* Filter tabs */}
                            <div className="flex gap-2">
                                {(["all", "pending", "accepted", "dispensed", "rejected"] as const).map(f => (
                                    <button key={f} onClick={() => setRxFilter(f)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${rxFilter === f ? "bg-violet-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"}`}>
                                        {f}
                                        <span className={`ml-1.5 text-xs ${rxFilter === f ? "opacity-70" : "text-slate-400"}`}>
                      ({f === "all" ? PRESCRIPTIONS.length : PRESCRIPTIONS.filter(p => p.status === f).length})
                    </span>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {["Rx ID", "Patient", "Doctor", "Pharmacy", "Medication", "Status", "Date", "Actions"].map(h => (
                                            <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {filteredPrescriptions.map(rx => (
                                        <tr key={rx.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3.5 text-xs font-mono text-slate-500">{rx.id}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Avatar initials={rx.patient.split(" ").map(n => n[0]).join("")} color={getColor(rx.patient)} />
                                                    <span className="text-sm font-medium text-slate-800">{rx.patient}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-sm text-slate-600">{rx.doctor}</td>
                                            <td className="px-4 py-3.5 text-sm text-slate-600">{rx.pharmacy}</td>
                                            <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{rx.drug}</td>
                                            <td className="px-4 py-3.5"><Badge status={rx.status} /></td>
                                            <td className="px-4 py-3.5 text-xs text-slate-400">{rx.date}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex gap-2">
                                                    <button className="text-xs text-violet-600 font-semibold hover:underline">View</button>
                                                    {rx.status === "pending" && (
                                                        <>
                                                            <button className="text-xs text-emerald-600 font-semibold hover:underline">Accept</button>
                                                            <button className="text-xs text-red-400 font-semibold hover:underline">Reject</button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                {filteredPrescriptions.length === 0 && (
                                    <div className="py-12 text-center text-slate-400">
                                        <p className="text-3xl mb-2">📋</p>
                                        <p className="font-semibold">No prescriptions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Appointments */}
                    {activeTab === "appointments" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Appointments</h2>
                                    <p className="text-sm text-slate-400">312 appointments today across all doctors</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Confirmed", value: 248, color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                                    { label: "Pending", value: 47, color: "bg-amber-50 border-amber-100 text-amber-700" },
                                    { label: "Cancelled", value: 17, color: "bg-red-50 border-red-100 text-red-600" },
                                ].map((c, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${c.color}`}>
                                        <p className="text-2xl font-black">{c.value}</p>
                                        <p className="text-xs font-semibold mt-0.5 opacity-70">{c.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {["ID", "Patient", "Doctor", "Specialty", "Date", "Time", "Status", "Actions"].map(h => (
                                            <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {APPOINTMENTS.map(apt => (
                                        <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{apt.id}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <Avatar initials={apt.patient.split(" ").map(n => n[0]).join("")} color={getColor(apt.patient)} />
                                                    <span className="text-sm font-medium text-slate-800">{apt.patient}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{apt.doctor}</td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full border border-violet-100 font-medium">{apt.specialty}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{apt.date}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-500">{apt.time}</td>
                                            <td className="px-5 py-3.5"><Badge status={apt.status} /></td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-2">
                                                    <button className="text-xs text-violet-600 font-semibold hover:underline">View</button>
                                                    {apt.status !== "cancelled" && <button className="text-xs text-red-400 font-semibold hover:underline">Cancel</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Analytics */}
                    {activeTab === "analytics" && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-slate-800">Analytics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm col-span-2">
                                    <p className="font-black text-slate-800 mb-1">Monthly Platform Growth</p>
                                    <p className="text-xs text-slate-400 mb-4">Appointments, prescriptions & new users</p>
                                    <MiniBarChart />
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <p className="font-black text-slate-800 mb-4">Patient Specialty Distribution</p>
                                    <DonutChart />
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <p className="font-black text-slate-800 mb-4">Key Metrics</p>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Avg. Appointment Wait Time", value: "2.3 days", pct: 45 },
                                            { label: "Rx Fulfillment Rate", value: "94.2%", pct: 94 },
                                            { label: "Patient Satisfaction", value: "4.8 / 5", pct: 96 },
                                            { label: "Doctor Utilisation", value: "78%", pct: 78 },
                                            { label: "Platform Uptime", value: "99.9%", pct: 99.9 },
                                        ].map((m, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-slate-600">{m.label}</span>
                                                    <span className="font-bold text-slate-800">{m.value}</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${m.pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === "settings" && (
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-xl font-black text-slate-800">Platform Settings</h2>
                            {[
                                { section: "General", fields: [{ label: "Platform Name", val: "Medily" }, { label: "Support Email", val: "support@medily.app" }, { label: "Time Zone", val: "UTC+05:30" }] },
                                { section: "Prescription Settings", fields: [{ label: "Max Active Rx per Patient", val: "5" }, { label: "Rx Expiry Days", val: "30" }] },
                                { section: "Notifications", fields: [{ label: "Admin Alert Email", val: "admin@medily.app" }] },
                            ].map((g, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-50 bg-slate-50">
                                        <p className="font-bold text-slate-700 text-sm">{g.section}</p>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {g.fields.map((f, j) => (
                                            <div key={j} className="flex items-center justify-between">
                                                <label className="text-sm text-slate-600 font-medium">{f.label}</label>
                                                <input defaultValue={f.val} className="text-sm border border-slate-200 rounded-xl px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 bg-violet-600 text-white font-semibold text-sm rounded-xl hover:bg-violet-700 transition-colors shadow-sm">Save Changes</button>
                                <button className="px-5 py-2.5 bg-white text-slate-600 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">Reset</button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}