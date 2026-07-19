import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const PendingVerification: React.FC = () => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const accountStatus = localStorage.getItem("accountStatus");
        const isSubscribed = localStorage.getItem("isSubscribed");
        // If already verified redirect appropriately
        if (accountStatus === "ACTIVE") {
            if (role === "DOCTOR" && isSubscribed !== "true") {
                navigate("/doctor-subscription");
            } else if (role === "DOCTOR") {
                navigate("/doctordashboard");
            } else {
                navigate("/pharmacydashboard");
            }
        }
    }, []);

    const namePrefix = role === "DOCTOR" ? "Dr. " : "";

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
             style={{ background: "#0a1929", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 -top-[200px] -right-[200px]"
                     style={{ filter: "blur(80px)", background: "radial-gradient(circle, #c5a3e0 0%, transparent 70%)" }} />
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 -bottom-[150px] -left-[150px]"
                     style={{ filter: "blur(80px)", background: "radial-gradient(circle, #7bc5d3 0%, transparent 70%)" }} />
            </div>

            <motion.div className="relative z-10 w-full max-w-lg"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>

                <div className="rounded-[32px] p-10 text-center"
                     style={{ background: "rgba(255,255,255,0.98)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: "linear-gradient(135deg, #7bc5d3, #c5a3e0)" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold" style={{ color: "#0f1c2e" }}>Medily</span>
                    </div>

                    {/* Animated clock */}
                    <motion.div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: "linear-gradient(135deg, rgba(123,197,211,0.15), rgba(197,163,224,0.15))", border: "2px solid rgba(123,197,211,0.3)" }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                            <defs>
                                <linearGradient id="clockGrad" x1="0" y1="0" x2="24" y2="24">
                                    <stop offset="0%" stopColor="#7bc5d3" />
                                    <stop offset="100%" stopColor="#c5a3e0" />
                                </linearGradient>
                            </defs>
                            <circle cx="12" cy="12" r="10" stroke="url(#clockGrad)" strokeWidth="2" />
                            <polyline points="12 6 12 12 16 14" stroke="url(#clockGrad)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </motion.div>

                    <h1 className="text-[28px] font-bold mb-2" style={{ color: "#0f1c2e" }}>
                        Verification Pending
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Welcome, <span className="font-bold text-gray-700">{namePrefix}{name}</span>!
                        Your {role === "DOCTOR" ? "medical registration" : "pharmacy license"} is
                        being reviewed by our admin team. This usually takes{" "}
                        <span className="font-semibold" style={{ color: "#7bc5d3" }}>24–48 hours</span>.
                    </p>

                    {/* Steps */}
                    <div className="rounded-2xl p-5 mb-6 text-left space-y-3"
                         style={{ background: "linear-gradient(135deg, rgba(123,197,211,0.08), rgba(197,163,224,0.08))", border: "1px solid rgba(123,197,211,0.2)" }}>
                        {[
                            { icon: "✅", text: "Account created successfully", done: true },
                            { icon: "🔍", text: "Registration under review", active: true },
                            { icon: "📧", text: "Email notification upon approval" },
                            { icon: "🚀", text: "Full platform access unlocked" },
                        ].map((step, i) => (
                            <div key={i} className={`flex items-center gap-3 text-sm`}>
                                <span className="text-base flex-shrink-0">{step.icon}</span>
                                <span style={{ color: step.active ? "#0f1c2e" : "#6b7280", fontWeight: step.active ? 700 : 400 }}>
                                    {step.text}
                                </span>
                                {step.active && (
                                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                                          style={{ background: "rgba(123,197,211,0.2)", color: "#7bc5d3" }}>
                                        In Progress
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="rounded-2xl p-4 mb-7 flex items-start gap-3 text-left"
                         style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                        <span className="text-lg flex-shrink-0">💡</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Once verified, you'll receive an email and an in-app notification.
                            Log back in to {role === "DOCTOR" ? "activate your subscription and start consulting" : "access your pharmacy dashboard"}.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <motion.button onClick={() => navigate("/login")}
                                       className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
                                       style={{ background: "linear-gradient(135deg, #0f1c2e, #1a2942)" }}
                                       whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            Back to Login
                        </motion.button>
                        <button onClick={logout}
                                className="w-full py-3 rounded-2xl text-sm font-semibold transition-colors"
                                style={{ color: "#6b7280", border: "2px solid #e5e7eb" }}>
                            Sign Out
                        </button>
                    </div>
                </div>

                <p className="text-center text-white/40 text-xs mt-5">
                    Having trouble? Contact us at{" "}
                    <a href="mailto:support@medily.com" className="text-white/60 underline">
                        support@medily.com
                    </a>
                </p>
            </motion.div>
        </div>
    );
};

export default PendingVerification;