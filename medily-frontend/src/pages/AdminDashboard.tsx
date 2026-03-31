// pages/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AdminTab = "overview" | "users" | "doctors" | "patients" | "pharmacies" | "appointments" | "activity";

const NAV_ITEMS: { id: AdminTab; label: string; icon: string; badge?: string }[] = [
    { id: "overview",     label: "Overview",      icon: "📊" },
    { id: "users",        label: "Users",         icon: "👥", badge: "142" },
    { id: "doctors",      label: "Doctors",       icon: "🩺", badge: "24" },
    { id: "patients",     label: "Patients",      icon: "🏥", badge: "98" },
    { id: "pharmacies",   label: "Pharmacies",    icon: "💊", badge: "12" },
    { id: "appointments", label: "Appointments",  icon: "📅" },
    { id: "activity",     label: "Activity Log",  icon: "📋" },
];

// Mock data
const MOCK_USERS = [
    { id: 1, name: "Dr. Sarah Mitchell", email: "sarah@medily.com", role: "DOCTOR",     status: "ACTIVE",   joined: "2025-01-15" },
    { id: 2, name: "Alice Johnson",      email: "alice@medily.com",  role: "PATIENT",    status: "ACTIVE",   joined: "2025-02-10" },
    { id: 3, name: "PharmaCare Negombo", email: "pharma@medily.com", role: "PHARMACIST", status: "ACTIVE",   joined: "2025-01-20" },
    { id: 4, name: "Dr. James Okafor",   email: "james@medily.com",  role: "DOCTOR",     status: "ACTIVE",   joined: "2025-03-01" },
    { id: 5, name: "Bob Patient",        email: "bob@medily.com",    role: "PATIENT",    status: "INACTIVE", joined: "2025-03-15" },
    { id: 6, name: "Dr. Priya Sharma",   email: "priya@medily.com",  role: "DOCTOR",     status: "ACTIVE",   joined: "2025-02-20" },
    { id: 7, name: "MedPlus Pharmacy",   email: "medplus@medily.com",role: "PHARMACIST", status: "ACTIVE",   joined: "2025-01-10" },
    { id: 8, name: "Emma Wilson",        email: "emma@medily.com",   role: "PATIENT",    status: "ACTIVE",   joined: "2025-04-01" },
];

const MOCK_APPOINTMENTS = [
    { id: 1, patient: "Alice Johnson",  doctor: "Dr. Sarah Mitchell", date: "2026-03-30", time: "09:00 AM", status: "BOOKED",    type: "Consultation" },
    { id: 2, patient: "Bob Patient",    doctor: "Dr. James Okafor",   date: "2026-03-30", time: "10:30 AM", status: "COMPLETED", type: "Follow-up" },
    { id: 3, patient: "Emma Wilson",    doctor: "Dr. Priya Sharma",   date: "2026-03-31", time: "02:00 PM", status: "BOOKED",    type: "Routine" },
    { id: 4, patient: "Alice Johnson",  doctor: "Dr. James Okafor",   date: "2026-04-01", time: "11:00 AM", status: "BOOKED",    type: "Consultation" },
    { id: 5, patient: "Bob Patient",    doctor: "Dr. Sarah Mitchell", date: "2026-03-28", time: "03:00 PM", status: "CANCELLED", type: "Routine" },
];

const MOCK_ACTIVITY = [
    { id: 1, user: "Dr. Sarah Mitchell", action: "Created prescription for Alice Johnson",   time: "2 min ago",  type: "prescription" },
    { id: 2, user: "Alice Johnson",      action: "Booked appointment with Dr. James Okafor", time: "15 min ago", type: "appointment" },
    { id: 3, user: "PharmaCare",         action: "Accepted prescription RX-2025-001",         time: "32 min ago", type: "pharmacy" },
    { id: 4, user: "Admin",              action: "New user registered: Emma Wilson",           time: "1 hr ago",   type: "user" },
    { id: 5, user: "Dr. James Okafor",   action: "Updated appointment status to COMPLETED",   time: "2 hr ago",   type: "appointment" },
    { id: 6, user: "MedPlus Pharmacy",   action: "Marked prescription as dispensed",          time: "3 hr ago",   type: "pharmacy" },
    { id: 7, user: "Bob Patient",        action: "Cancelled appointment",                      time: "5 hr ago",   type: "appointment" },
    { id: 8, user: "Admin",              action: "Deactivated user account: Bob Patient",      time: "1 day ago",  type: "user" },
];

const roleColors: Record<string, string> = {
    DOCTOR:     "bg-indigo-100 text-indigo-700",
    PATIENT:    "bg-emerald-100 text-emerald-700",
    PHARMACIST: "bg-violet-100 text-violet-700",
    ADMIN:      "bg-rose-100 text-rose-700",
};

const statusColors: Record<string, string> = {
    ACTIVE:    "bg-emerald-100 text-emerald-700",
    INACTIVE:  "bg-gray-100 text-gray-500",
    BOOKED:    "bg-blue-100 text-blue-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-600",
};

const activityIcons: Record<string, string> = {
    prescription: "📋",
    appointment:  "📅",
    pharmacy:     "💊",
    user:         "👤",
};

// ── Overview ────────────────────────────────────────────────────────────────
const OverviewPage: React.FC<{ userName: string; onNavigate: (tab: AdminTab) => void }> = ({ userName, onNavigate }) => {
    const totalUsers      = MOCK_USERS.length;
    const totalDoctors    = MOCK_USERS.filter(u => u.role === "DOCTOR").length;
    const totalPatients   = MOCK_USERS.filter(u => u.role === "PATIENT").length;
    const totalPharmacies = MOCK_USERS.filter(u => u.role === "PHARMACIST").length;
    const activeUsers     = MOCK_USERS.filter(u => u.status === "ACTIVE").length;
    const todayApts       = MOCK_APPOINTMENTS.filter(a => a.date === "2026-03-30").length;

    return (
        <div className="space-y-6">
            {/* Admin card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="relative">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff&size=80`} alt="" className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-lg" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1">
                        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">System Administrator</div>
                        <h2 className="text-2xl font-black mt-0.5">{userName}</h2>
                        <div className="text-white/60 text-sm mt-1">Full platform access · Medily Healthcare System</div>
                    </div>
                    <div className="flex gap-6 sm:gap-8">
                        {[["142","Total Users"],["24","Doctors"],["98","Patients"]].map(([v,l]) => (
                            <div key={l} className="text-center">
                                <div className="text-3xl font-black">{v}</div>
                                <div className="text-white/60 text-xs mt-0.5">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Users",  value: totalUsers,      icon: "👥", color: "from-blue-400 to-indigo-500",   tab: "users" as AdminTab },
                    { label: "Doctors",      value: totalDoctors,    icon: "🩺", color: "from-violet-400 to-purple-500", tab: "doctors" as AdminTab },
                    { label: "Patients",     value: totalPatients,   icon: "🏥", color: "from-emerald-400 to-teal-500",  tab: "patients" as AdminTab },
                    { label: "Pharmacies",   value: totalPharmacies, icon: "💊", color: "from-amber-400 to-orange-500",  tab: "pharmacies" as AdminTab },
                ].map(s => (
                    <button key={s.label} onClick={() => onNavigate(s.tab)} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-left">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
                        <div className="text-2xl font-black text-gray-800">{s.value}</div>
                        <div className="text-sm font-semibold text-gray-600 mt-0.5">{s.label}</div>
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                {/* Platform Health */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-4">Platform Health</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Active Users",       value: activeUsers, total: totalUsers, color: "bg-emerald-500" },
                            { label: "Appointments Today", value: todayApts,   total: 10,         color: "bg-blue-500" },
                            { label: "System Uptime",      value: 99,          total: 100,        color: "bg-violet-500" },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-3">
                                <div className="text-sm text-gray-600 w-40 flex-shrink-0">{s.label}</div>
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                    <div className={`${s.color} h-2 rounded-full`} style={{ width: `${(s.value / s.total) * 100}%` }} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 w-12 text-right">{s.value}/{s.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
                        <button onClick={() => onNavigate("activity")} className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">View all →</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {MOCK_ACTIVITY.slice(0, 5).map(a => (
                            <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{activityIcons[a.type]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-800 truncate">{a.user}</div>
                                    <div className="text-xs text-gray-500 truncate">{a.action}</div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900 text-sm">Today's Appointments</h3>
                    <button onClick={() => onNavigate("appointments")} className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">View all →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {["Patient","Doctor","Time","Type","Status"].map(h => (
                                <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {MOCK_APPOINTMENTS.filter(a => a.date === "2026-03-30").map(a => (
                            <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-5 py-3 text-sm font-semibold text-gray-800">{a.patient}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{a.doctor}</td>
                                <td className="px-5 py-3 text-sm text-gray-600">{a.time}</td>
                                <td className="px-5 py-3"><span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{a.type}</span></td>
                                <td className="px-5 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[a.status]}`}>{a.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ── Users Table ──────────────────────────────────────────────────────────────
const UsersPage: React.FC<{ roleFilter?: string; title: string }> = ({ roleFilter, title }) => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(MOCK_USERS);

    const filtered = users.filter(u => {
        const matchRole = !roleFilter || u.role === roleFilter;
        const q = search.toLowerCase();
        return matchRole && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    });

    const toggleStatus = (id: number) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : u));
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">{title}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Manage and monitor {title.toLowerCase()}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    + Add New
                </button>
            </div>

            <div className="relative w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-colors bg-white" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {["Name","Email","Role","Status","Joined","Actions"].map(h => (
                                <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filtered.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=40`} alt="" className="w-8 h-8 rounded-lg" />
                                        <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-gray-500">{u.email}</td>
                                <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleColors[u.role]}`}>{u.role}</span></td>
                                <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[u.status]}`}>{u.status}</span></td>
                                <td className="px-5 py-3.5 text-sm text-gray-500">{u.joined}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleStatus(u.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${u.status === "ACTIVE" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                                            {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                        </button>
                                        <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">View</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-gray-500 font-medium">No results found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Appointments ─────────────────────────────────────────────────────────────
const AppointmentsPage: React.FC = () => {
    const [filter, setFilter] = useState<"all" | "BOOKED" | "COMPLETED" | "CANCELLED">("all");
    const filtered = MOCK_APPOINTMENTS.filter(a => filter === "all" || a.status === filter);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-black text-gray-900">All Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">Monitor all appointments across the platform</p>
            </div>
            <div className="flex gap-2">
                {(["all", "BOOKED", "COMPLETED", "CANCELLED"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200"}`}>
                        {f === "all" ? "All" : f}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {["ID","Patient","Doctor","Date","Time","Type","Status"].map(h => (
                                <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filtered.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-5 py-3.5"><span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">#{a.id}</span></td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{a.patient}</td>
                                <td className="px-5 py-3.5 text-sm text-gray-600">{a.doctor}</td>
                                <td className="px-5 py-3.5 text-sm text-gray-600">{a.date}</td>
                                <td className="px-5 py-3.5 text-sm text-gray-600">{a.time}</td>
                                <td className="px-5 py-3.5"><span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{a.type}</span></td>
                                <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[a.status]}`}>{a.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ── Activity Log ─────────────────────────────────────────────────────────────
const ActivityLogPage: React.FC = () => (
    <div className="space-y-5">
        <div>
            <h1 className="text-2xl font-black text-gray-900">Activity Log</h1>
            <p className="text-gray-500 text-sm mt-0.5">Full audit trail of all platform actions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {MOCK_ACTIVITY.map((a, i) => (
                <div key={a.id} className={`flex items-center gap-4 px-5 py-4 ${i < MOCK_ACTIVITY.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{activityIcons[a.type]}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">{a.user}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                a.type === "prescription" ? "bg-blue-100 text-blue-700" :
                                    a.type === "appointment"  ? "bg-indigo-100 text-indigo-700" :
                                        a.type === "pharmacy"     ? "bg-teal-100 text-teal-700" :
                                            "bg-gray-100 text-gray-600"
                            }`}>{a.type}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">{a.action}</div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{a.time}</span>
                </div>
            ))}
        </div>
    </div>
);

// ── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
    const [userName, setUserName] = useState("Admin");
    const [activeTab, setActiveTab] = useState<AdminTab>("overview");
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role  = localStorage.getItem("role");
        const name  = localStorage.getItem("name");
        if (token && role === "ADMIN") {
            setUserName(name ?? "Admin");
        } else {
            navigate("/login");
        }
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case "overview":     return <OverviewPage userName={userName} onNavigate={setActiveTab} />;
            case "users":        return <UsersPage title="All Users" />;
            case "doctors":      return <UsersPage title="Doctors" roleFilter="DOCTOR" />;
            case "patients":     return <UsersPage title="Patients" roleFilter="PATIENT" />;
            case "pharmacies":   return <UsersPage title="Pharmacies" roleFilter="PHARMACIST" />;
            case "appointments": return <AppointmentsPage />;
            case "activity":     return <ActivityLogPage />;
            default: return null;
        }
    };

    const pageTitles: Record<AdminTab, string> = {
        overview:     "Admin Overview",
        users:        "All Users",
        doctors:      "Doctors",
        patients:     "Patients",
        pharmacies:   "Pharmacies",
        appointments: "Appointments",
        activity:     "Activity Log",
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">

            {/* Sidebar */}
            <aside className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${sidebarExpanded ? "w-64" : "w-16"} sticky top-0 h-screen overflow-hidden shadow-sm`}>

                {/* Logo + toggle */}
                <div className={`flex items-center border-b border-gray-50 flex-shrink-0 h-16 ${sidebarExpanded ? "px-5 justify-between" : "px-0 justify-center"}`}>
                    {sidebarExpanded && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">M</div>
                            <span className="font-black text-gray-900 text-lg tracking-tight">Medily Admin</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex-shrink-0 ${!sidebarExpanded ? "mx-auto" : ""}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {sidebarExpanded
                                ? <><polyline points="15 18 9 12 15 6"/><line x1="20" y1="12" x2="9" y2="12"/></>
                                : <><polyline points="9 18 15 12 9 6"/><line x1="4" y1="12" x2="15" y2="12"/></>}
                        </svg>
                    </button>
                </div>

                {/* User card */}
                {sidebarExpanded && (
                    <div className="px-4 py-4 mx-3 mt-3 bg-slate-50 rounded-2xl flex items-center gap-3 flex-shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`} alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
                        <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-sm truncate">{userName}</div>
                            <div className="text-indigo-500 text-xs font-semibold">Administrator</div>
                        </div>
                    </div>
                )}

                {/* Nav items */}
                <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            title={!sidebarExpanded ? item.label : undefined}
                            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all
                                ${sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}
                                ${activeTab === item.id
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <span className="flex-shrink-0 text-base">{item.icon}</span>
                            {sidebarExpanded && (
                                <>
                                    <span className="flex-1 text-left truncate">{item.label}</span>
                                    {item.badge && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${activeTab === item.id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-2 py-3 border-t border-gray-50 flex-shrink-0">
                    <button
                        onClick={logout}
                        title={!sidebarExpanded ? "Logout" : undefined}
                        className={`w-full flex items-center rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all
                            ${sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        {sidebarExpanded && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center gap-4 sticky top-0 z-20 shadow-sm flex-shrink-0">
                    <div className="flex-1">
                        <h2 className="font-black text-gray-900 text-base">{pageTitles[activeTab]}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-700 text-xs font-semibold">System Online</span>
                        </div>
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`}
                            alt=""
                            className="w-9 h-9 rounded-xl border-2 border-indigo-100 cursor-pointer"
                        />
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;