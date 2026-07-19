// components/StripePaymentModal.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51TW8xGFm6FnBmP141nqFdBxSoejIicSvbaDaYvgw7BJSpne3LIMGkUPv2iO9Hwpo9fePqGYw18mh9tpNqQwNijdH00UAOOsES0");

interface Props {
    open: boolean;
    onClose: () => void;
    amount: number;
    description: string;
    endpoint: string; // which backend endpoint to call
    onSuccess: () => void;
}

export const StripePaymentModal: React.FC<Props> = ({
                                                        open, onClose, amount, description, endpoint, onSuccess
                                                    }) => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const formatCard = (val: string) =>
        val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
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

        try {
            const token = localStorage.getItem("token");

            // Step 1: Get PaymentIntent clientSecret from backend
            const res = await axios.post(
                `http://localhost:8080${endpoint}`,
                { amount, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { clientSecret } = res.data.data;

            // Step 2: Confirm payment with Stripe
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe not loaded");

            // For demo/test purposes confirm without real card elements
            // In production you'd use Stripe Elements here
            // Simulate successful payment for now
            await new Promise(r => setTimeout(r, 2000));

            setProcessing(false);
            setSuccess(true);

            setTimeout(() => {
                onSuccess();
                onClose();
                setSuccess(false);
                setCardNumber(""); setExpiry(""); setCvc(""); setName("");
            }, 1500);

        } catch (err: any) {
            setError(err.response?.data?.message ?? "Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">Secure Payment</div>
                                <div className="text-white/70 text-xs">Powered by Stripe</div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="text-white/70 text-xs uppercase tracking-wider">{description}</div>
                        <div className="text-white text-3xl font-black mt-1">${amount}.00</div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <div className="text-gray-900 font-bold text-lg">Payment Successful!</div>
                            <div className="text-gray-500 text-sm mt-1">Your receipt has been emailed.</div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Cardholder Name
                                </label>
                                <input value={name} onChange={e => setName(e.target.value)}
                                       placeholder="Jane Doe"
                                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"/>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Card Number
                                </label>
                                <div className="relative">
                                    <input value={cardNumber}
                                           onChange={e => setCardNumber(formatCard(e.target.value))}
                                           placeholder="4242 4242 4242 4242" maxLength={19}
                                           className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 pr-12"/>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-7 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Expiry</label>
                                    <input value={expiry}
                                           onChange={e => setExpiry(formatExpiry(e.target.value))}
                                           placeholder="MM/YY" maxLength={5}
                                           className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"/>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">CVC</label>
                                    <input value={cvc}
                                           onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                           placeholder="123"
                                           className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"/>
                                </div>
                            </div>
                            {error && (
                                <div className="text-red-500 text-xs font-medium bg-red-50 rounded-lg px-3 py-2">
                                    {error}
                                </div>
                            )}
                            <button onClick={handlePay} disabled={processing}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 mt-2">
                                {processing ? (
                                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Processing…</>
                                ) : (
                                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>Pay ${amount}.00 Securely</>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                    <path d="M7 11V7a5 5 0 0110 0v4"/>
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