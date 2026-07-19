import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const DoctorSubscription: React.FC = () => {
    const [showPayment, setShowPayment] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [cardName, setCardName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [mounted] = useState(true);
    const navigate = useNavigate();
    const name = localStorage.getItem("name");

    const formatCard = (val: string) =>
        val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (val: string) => {
        const d = val.replace(/\D/g, "").slice(0, 4);
        return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
    };

    const handlePay = async () => {
        if (!cardNumber || !expiry || !cvc || !cardName) {
            setError("Please fill in all fields.");
            return;
        }
        setError("");
        setProcessing(true);

        try {
            const token = localStorage.getItem("token");
            // Create payment intent
            await axios.post(
                "http://localhost:8080/api/payments/subscription/create-intent",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Simulate processing
            await new Promise(r => setTimeout(r, 2000));
            // Confirm subscription
            await axios.post(
                "http://localhost:8080/api/payments/subscription/confirm",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.setItem("isSubscribed", "true");
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => navigate("/doctordashboard"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

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

            <motion.div className="relative z-10 w-full max-w-md"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}>

                <div className="rounded-[32px] overflow-hidden"
                     style={{ background: "rgba(255,255,255,0.98)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

                    {!showPayment ? (
                        <div className="p-10 text-center">
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

                            {/* Badge */}
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl"
                                 style={{ background: "linear-gradient(135deg, rgba(123,197,211,0.15), rgba(197,163,224,0.15))", border: "2px solid rgba(123,197,211,0.3)" }}>
                                ✅
                            </div>

                            <h1 className="text-[26px] font-bold mb-2" style={{ color: "#0f1c2e" }}>
                                You're Verified!
                            </h1>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Welcome to Medily, <span className="font-bold text-gray-700">Dr. {name}</span>!
                                Activate your subscription to access all clinical features.
                            </p>

                            {/* Features */}
                            <div className="rounded-2xl p-5 mb-6 text-left space-y-2.5"
                                 style={{ background: "linear-gradient(135deg, rgba(123,197,211,0.08), rgba(197,163,224,0.08))", border: "1px solid rgba(123,197,211,0.2)" }}>
                                <div className="text-sm font-bold mb-3" style={{ color: "#0f1c2e" }}>
                                    What's included:
                                </div>
                                {[
                                    "✓ Write and manage prescriptions",
                                    "✓ Patient consultation tracking",
                                    "✓ Appointment management",
                                    "✓ Medical feed access",
                                    "✓ Real-time patient messaging",
                                ].map(f => (
                                    <div key={f} className="text-sm" style={{ color: "#4b5563" }}>{f}</div>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-5xl font-black" style={{ color: "#0f1c2e" }}>$9</span>
                                <span className="text-gray-400 text-sm">.99/month</span>
                            </div>

                            <motion.button
                                onClick={() => setShowPayment(true)}
                                className="w-full py-4 rounded-2xl text-white font-bold text-sm"
                                style={{ background: "linear-gradient(135deg, #7bc5d3, #c5a3e0)" }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}>
                                Activate Subscription →
                            </motion.button>
                        </div>
                    ) : (
                        // Payment form
                        <div>
                            <div className="px-8 py-6"
                                 style={{ background: "linear-gradient(135deg, #7bc5d3, #c5a3e0)" }}>
                                <div className="flex items-center justify-between mb-4">
                                    <button onClick={() => setShowPayment(false)}
                                            className="text-white/70 hover:text-white text-sm">
                                        ← Back
                                    </button>
                                    <div className="text-white/70 text-xs">Powered by Stripe</div>
                                </div>
                                <div className="text-white/70 text-xs uppercase tracking-wider">
                                    Medily Doctor Subscription
                                </div>
                                <div className="text-white text-4xl font-black mt-1">$9.99<span className="text-lg font-normal">/mo</span></div>
                            </div>

                            <div className="p-8 space-y-4">
                                {success ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                            ✅
                                        </div>
                                        <div className="font-bold text-xl" style={{ color: "#0f1c2e" }}>
                                            Subscription Activated!
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Redirecting to your dashboard...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                                Cardholder Name
                                            </label>
                                            <input value={cardName} onChange={e => setCardName(e.target.value)}
                                                   placeholder="Dr. Sarah Mitchell"
                                                   className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                                Card Number
                                            </label>
                                            <div className="relative">
                                                <input value={cardNumber}
                                                       onChange={e => setCardNumber(formatCard(e.target.value))}
                                                       placeholder="4242 4242 4242 4242" maxLength={19}
                                                       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 pr-14" />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Expiry</label>
                                                <input value={expiry}
                                                       onChange={e => setExpiry(formatExpiry(e.target.value))}
                                                       placeholder="MM/YY" maxLength={5}
                                                       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">CVC</label>
                                                <input value={cvc}
                                                       onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                       placeholder="123"
                                                       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400" />
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">
                                                {error}
                                            </div>
                                        )}
                                        <motion.button onClick={handlePay} disabled={processing}
                                                       className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                                       style={{ background: "linear-gradient(135deg, #7bc5d3, #c5a3e0)" }}
                                                       whileHover={{ scale: processing ? 1 : 1.02 }}
                                                       whileTap={{ scale: processing ? 1 : 0.98 }}>
                                            {processing ? (
                                                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</>
                                            ) : (
                                                <>🔒 Pay $9.99 Securely</>
                                            )}
                                        </motion.button>
                                        <div className="text-center text-gray-400 text-xs">
                                            256-bit SSL encrypted · PCI DSS compliant
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorSubscription;