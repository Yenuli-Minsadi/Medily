import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface ProfileSettingsProps {
    onClose?: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
    const [name, setName] = useState(localStorage.getItem("name") ?? "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    const role = localStorage.getItem("role") ?? "";
    const email = localStorage.getItem("email") ?? "";
    const token = localStorage.getItem("token");

    useEffect(() => {
        setMounted(true);
        // Load existing profile
        axios.get("http://localhost:8080/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const data = res.data.data;
            setName(data.fullName ?? "");
            setPhone(data.phone ?? "");
            setAddress(data.address ?? "");
        }).catch(() => {});
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch("http://localhost:8080/api/profile",
                { fullName: name, phone, address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.setItem("name", name);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const roleLabel: Record<string, string> = {
        DOCTOR: "Doctor", PATIENT: "Patient",
        PHARMACIST: "Pharmacist", ADMIN: "Administrator"
    };

    const roleColor: Record<string, string> = {
        DOCTOR: "from-indigo-500 to-violet-600",
        PATIENT: "from-emerald-500 to-teal-600",
        PHARMACIST: "from-amber-500 to-orange-600",
        ADMIN: "from-slate-600 to-slate-800"
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
            <motion.div className="w-full max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                        transition={{ duration: 0.4 }}>

                {/* Header */}
                <div className={`bg-gradient-to-r ${roleColor[role] ?? "from-indigo-500 to-violet-600"} rounded-3xl p-6 text-white mb-5 shadow-xl`}>
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl border-2 border-white/30 overflow-hidden bg-white/20">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=4f46e5&size=80`}
                                        alt="" className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <div>
                            <div className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                                {roleLabel[role]}
                            </div>
                            <h2 className="text-2xl font-black mt-0.5">{name}</h2>
                            <div className="text-white/70 text-sm mt-1">{email}</div>
                        </div>
                        {onClose && (
                            <button onClick={onClose} className="ml-auto text-white/70 hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h3 className="font-bold text-gray-900">Personal Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                Full Name
                            </label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                   className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                Email
                            </label>
                            <input value={email} readOnly
                                   className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 cursor-not-allowed text-gray-400" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                Phone
                            </label>
                            <input value={phone} onChange={e => setPhone(e.target.value)}
                                   placeholder="+94 77 123 4567"
                                   className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                Address
                            </label>
                            <input value={address} onChange={e => setAddress(e.target.value)}
                                   placeholder="Colombo, Sri Lanka"
                                   className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                        </div>
                    </div>

                    {/* Role-specific fields */}
                    {role === "DOCTOR" && (
                        <div className="pt-4 border-t border-gray-50 space-y-4">
                            <h3 className="font-bold text-gray-900">Professional Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Specialization
                                    </label>
                                    <input readOnly value={localStorage.getItem("specialization") ?? ""}
                                           className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                        Registration No.
                                    </label>
                                    <input readOnly value={localStorage.getItem("medicalRegNumber") ?? ""}
                                           className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400" />
                                </div>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
                                <span className="text-indigo-600 text-lg">✅</span>
                                <div>
                                    <div className="text-indigo-700 font-bold text-sm">Verified Doctor</div>
                                    <div className="text-indigo-500 text-xs">Your credentials have been verified by Medily</div>
                                </div>
                                <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                                    localStorage.getItem("isSubscribed") === "true"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}>
                                    {localStorage.getItem("isSubscribed") === "true" ? "Subscribed" : "Free Tier"}
                                </span>
                            </div>
                        </div>
                    )}

                    {role === "PHARMACIST" && (
                        <div className="pt-4 border-t border-gray-50">
                            <div className="bg-violet-50 rounded-xl p-3 flex items-center gap-3">
                                <span className="text-violet-600 text-lg">💊</span>
                                <div>
                                    <div className="text-violet-700 font-bold text-sm">Verified Pharmacy</div>
                                    <div className="text-violet-500 text-xs">License verified by Medily Admin</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Profile updated successfully!
                        </div>
                    )}

                    <motion.button onClick={handleSave} disabled={saving}
                                   className="w-full py-3.5 rounded-2xl text-white font-bold text-sm disabled:opacity-70"
                                   style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                                   whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileSettings;