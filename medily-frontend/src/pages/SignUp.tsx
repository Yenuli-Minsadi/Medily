import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";
import { saveAuth, redirectByRole } from "../lib/auth";
import type { SignUpFormData } from "../types/Auth";

type FormErrors = Record<string, string>;
const roleOptions = [
    {
        value: "patient",
        label: "Patient",
        description: "Manage your health records and connect with doctors",
    },
    {
        value: "doctor",
        label: "Doctor",
        description: "Access patient records and manage your practice",
    },
    {
        value: "professional",
        label: "Healthcare Professional",
        description: "For nurses, pharmacists, and other medical staff",
    },
];

const RoleIcon = ({ value, selected }: { value: string; selected: boolean }) => {
    const color = selected ? "white" : "#7bc5d3";
    if (value === "patient")
        return (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        );
    if (value === "doctor")
        return (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
        );
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
    );
};

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        userType: "",
        password: "",
        confirmPassword: "",
        terms: false,
        // Added these to original state
        specialization: "",
        medicalRegNumber: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const calc = (pw: string) => {
            let s = 0;
            if (pw.length >= 8) s += 25;
            if (pw.length >= 12) s += 25;
            if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 25;
            if (/\d/.test(pw)) s += 15;
            if (/[^a-zA-Z0-9]/.test(pw)) s += 10;
            return Math.min(s, 100);
        };
        setPasswordStrength(calc(formData.password));
    }, [formData.password]);

    const validateField = (name: string, value: string | boolean): string => {
        switch (name) {
            case "email":
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) ? "Please enter a valid email address" : "";
            case "phone":
                return !/^\+?[\d\s\-()]+$/.test(value as string) ? "Please enter a valid phone number" : "";
            case "password":
                return (value as string).length < 8 ? "Password must be at least 8 characters" : "";
            case "confirmPassword":
                return value !== formData.password ? "Passwords do not match" : "";
            default:
                return "";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const fieldValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: fieldValue }));
        if (value && name !== "specialization" && name !== "medicalRegNumber") {
            const error = validateField(name, fieldValue);
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {};
        if (!formData.terms) newErrors.terms = "You must agree to the terms";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        const roleMap: Record<string, string> = {
            patient:      "PATIENT",
            doctor:       "DOCTOR",
            professional: "PHARMACIST",
        };

        try {
            const data = await registerApi({
                name:   formData.userType === "professional"
                        ? (formData as any).pharmacyName
                        :`${formData.firstName} ${formData.lastName}`,
                email:            formData.email,
                password:         formData.password,
                role:             roleMap[formData.userType] ?? "PATIENT",
                specialization:   formData.specialization,
                medicalRegNumber: formData.medicalRegNumber,
                pharmacyLicenseNumber: (formData as any).pharmacyLicenseNumber,
            });

            saveAuth(data);

            // Redirect based on role AND account status
            if (data.role === "DOCTOR" || data.role === "PHARMACIST") {
                navigate("/pending-verification");
            } else {
                navigate(redirectByRole(data.role));
            }

        } catch (err: any) {
            setErrors({
                confirmPassword: err.response?.data?.message ?? "Registration failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const goNext = () => {
        if (currentStep === 1) {
            if (!formData.userType) {
                setErrors({ userType: "Please select your role to continue" });
                return;
            }

            if (formData.userType === "doctor") {
                if (!formData.specialization || !formData.medicalRegNumber) {
                    setErrors({ userType: "Specialization and Registration Number are required for doctors" });
                    return;
                }
            }

            if (formData.userType === "professional") {
                if (!(formData as any).pharmacyLicenseNumber) {
                    setErrors({ userType: "Pharmacy license number is required" });
                    return;
                }
            }
            setCurrentStep(2); setErrors({});
        } else if (currentStep === 2) {
            const errs: FormErrors = {};
            // (["firstName", "lastName", "email", "phone"] as Array<keyof SignUpFormData>).forEach((f) => {
            //     const val = formData[f] as string;
            //     const err = validateField(f, val);
            //     if (err || !val) errs[f] = err || "This field is required";
            // });
            if (formData.userType === "professional") {
                // Pharmacy validation
                if (!(formData as any).pharmacyName) errs.pharmacyName = "Pharmacy name is required";
                if (!formData.firstName) errs.firstName = "Owner name is required";
                if (!formData.email) errs.email = "Email is required";
            } else {
                // Patient/Doctor validation
                (["firstName", "lastName", "email", "phone"] as Array<keyof SignUpFormData>).forEach((f) => {
                    const val = formData[f] as string;
                    const err = validateField(f, val);
                    if (err || !val) errs[f] = err || "This field is required";
                });
            }
            if (Object.keys(errs).length === 0) { setCurrentStep(3); setErrors({}); }
            else setErrors(errs);
        }
    };

    const goPrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); setErrors({}); } };
    const handleStepClick = (step: number) => { if (step < currentStep) { setCurrentStep(step); setErrors({}); } };

    const strengthColor = () => {
        if (passwordStrength < 30) return "#ef4444";
        if (passwordStrength < 60) return "#f59e0b";
        if (passwordStrength < 80) return "#3b82f6";
        return "#10b981";
    };
    const strengthText = () => {
        if (passwordStrength < 30) return "Weak";
        if (passwordStrength < 60) return "Fair";
        if (passwordStrength < 80) return "Good";
        return "Strong";
    };

    const stepLabels = ["Your Role", "Personal Info", "Account Setup"];
    const stepHeaders = [
        { title: "Who are you joining as?", sub: "Choose your role so we can tailor your experience" },
        { title: "Tell us about yourself", sub: "Your details help us personalise your profile" },
        { title: "Secure your account", sub: "Set up a strong password to protect your data" },
    ];
    const selectedRole = roleOptions.find((r) => r.value === formData.userType);
    const progressWidth = currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%";

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden" style={{ background: "#0a1929", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] rounded-full opacity-25 -top-[200px] -right-[200px]"
                     style={{ filter: "blur(80px)", background: "radial-gradient(circle, #c5a3e0 0%, transparent 70%)" }} />
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-25 -bottom-[150px] -left-[150px]"
                     style={{ filter: "blur(80px)", background: "radial-gradient(circle, #7bc5d3 0%, transparent 70%)" }} />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-[520px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="rounded-[32px] p-12" style={{ background: "rgba(255,255,255,0.98)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7bc5d3, #c5a3e0)" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#g1)" />
                                <path d="M2 17L12 22L22 17" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="g1" x1="2" y1="2" x2="22" y2="12">
                                        <stop offset="0%" stopColor="#7BC5D3" /><stop offset="100%" stopColor="#C5A3E0" />
                                    </linearGradient>
                                    <linearGradient id="g2" x1="2" y1="17" x2="22" y2="22">
                                        <stop offset="0%" stopColor="#B8E0E8" /><stop offset="100%" stopColor="#E8D5F2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-[26px] font-bold" style={{ color: "#0f1c2e" }}>Medily</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex gap-1 mb-3.5">
                            {[1, 2, 3].map((step) => {
                                const isActive = currentStep >= step;
                                const isDone = step < currentStep;
                                return (
                                    <div key={step} onClick={() => handleStepClick(step)}
                                         className={`flex items-center gap-2 flex-1 ${isDone ? "cursor-pointer" : "cursor-default"}`}>
                                        <div className="w-[30px] h-[30px] flex-shrink-0 rounded-full flex items-center justify-center font-bold text-[13px]"
                                             style={{
                                                 background: isDone ? "linear-gradient(135deg,#10b981,#059669)" : isActive ? "linear-gradient(135deg,#7bc5d3,#c5a3e0)" : "#e5e7eb",
                                                 color: isActive ? "white" : "#9ca3af",
                                             }}>
                                            {isDone ? "✓" : step}
                                        </div>
                                        <span className={`text-[11px] whitespace-nowrap ${isActive ? "font-bold text-[#1a1a1a]" : "font-medium text-[#9ca3af]"}`}>
                                            {stepLabels[step - 1]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-1 bg-gray-200 rounded-sm overflow-hidden">
                            <motion.div
                                className="h-full rounded-sm"
                                style={{ background: "linear-gradient(90deg,#7bc5d3,#c5a3e0)" }}
                                animate={{ width: progressWidth }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-7">
                        <h1 className="text-[26px] font-bold leading-tight mb-1.5" style={{ color: "#1a1a1a" }}>
                            {stepHeaders[currentStep - 1].title}
                        </h1>
                        <p className="text-sm leading-[1.55] text-gray-500 m-0">
                            {stepHeaders[currentStep - 1].sub}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">

                            {/* STEP 1: Role Selection & Doctor Details */}
                            {currentStep === 1 && (
                                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
                                    <div className="flex flex-col gap-2.5">
                                        {roleOptions.map((role) => {
                                            const isSelected = formData.userType === role.value;
                                            return (
                                                <div key={role.value} onClick={() => setFormData((prev) => ({ ...prev, userType: role.value }))}
                                                     className="flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer select-none transition-all duration-200"
                                                     style={{
                                                         border: isSelected ? "2px solid #7bc5d3" : "2px solid #e5e7eb",
                                                         background: isSelected ? "linear-gradient(135deg, rgba(123,197,211,0.08), rgba(197,163,224,0.08))" : "white",
                                                         boxShadow: isSelected ? "0 4px 20px rgba(123,197,211,0.16)" : "none",
                                                     }}>
                                                    <div className="w-[46px] h-[46px] flex-shrink-0 rounded-xl flex items-center justify-center"
                                                         style={{ background: isSelected ? "linear-gradient(135deg,#7bc5d3,#c5a3e0)" : "linear-gradient(135deg,#f0f9fb,#f5effe)" }}>
                                                        <RoleIcon value={role.value} selected={isSelected} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="block text-sm font-bold mb-0.5" style={{ color: "#1a1a1a" }}>{role.label}</span>
                                                        <span className="block text-xs text-gray-500">{role.description}</span>
                                                    </div>
                                                    <div className={`w-[22px] h-[22px] flex-shrink-0 rounded-full flex items-center justify-center ${isSelected ? "bg-gradient-to-br from-[#7bc5d3] to-[#c5a3e0]" : "border-2 border-gray-200"}`}>
                                                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* DOCTOR FIELDS - INJECTED INTO STEP 1 */}
                                    {formData.userType === "doctor" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 space-y-4 pt-5 border-t border-gray-100">
                                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-[11px] text-indigo-700 font-medium">
                                                🏥 Doctor accounts require manual verification before clinical access is granted.
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Specialization</label>
                                                <select name="specialization" value={formData.specialization} onChange={handleChange}
                                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 bg-white">
                                                    <option value="">Select specialization</option>
                                                    <option>Cardiologist</option><option>Dermatologist</option><option>Neurologist</option>
                                                    <option>Pediatrician</option><option>Psychiatrist</option><option>General Practitioner</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Medical Registration Number</label>
                                                <input type="text" name="medicalRegNumber" value={formData.medicalRegNumber} onChange={handleChange} placeholder="e.g. SLMC-12345"
                                                       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 font-sans" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {formData.userType === "professional" && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 space-y-4 pt-5 border-t border-gray-100">
                                            <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 text-[11px] text-violet-700 font-medium">
                                                💊 Pharmacy accounts require license verification before access is granted.
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                                    Pharmacy Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyName"
                                                    value={(formData as any).pharmacyName ?? ""}
                                                    onChange={handleChange}
                                                    placeholder="e.g. MedPlus Pharmacy"
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 font-sans"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                                    Pharmacy License Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyLicenseNumber"
                                                    value={(formData as any).pharmacyLicenseNumber ?? ""}
                                                    onChange={handleChange}
                                                    placeholder="e.g. PH-12345"
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 font-sans"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                                    City / Location
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pharmacyCity"
                                                    value={(formData as any).pharmacyCity ?? ""}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Colombo"
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 font-sans"
                                                />
                                            </div>
                                        </motion.div>
                                    )}     

                                    {errors.userType && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.userType}</span>}

                                    <div className="flex justify-center mt-7">
                                        <motion.button type="button" onClick={goNext}
                                                       className="min-w-[200px] py-3.5 px-6 border-none rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                                                       style={{ background: "linear-gradient(135deg, #0f1c2e 0%, #1a2942 100%)" }}
                                                       whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            Continue
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/*/!* STEP 2: Personal Info *!/*/}
                            {/*{currentStep === 2 && (*/}
                            {/*    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>*/}
                            {/*        <div className="grid grid-cols-2 gap-4">*/}
                            {/*            <div className="mb-4">*/}
                            {/*                <label className="block text-[13px] font-semibold mb-[7px]">First Name</label>*/}
                            {/*                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Sarah"*/}
                            {/*                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"*/}
                            {/*                       style={{ borderColor: errors.firstName ? "#ef4444" : "#e5e7eb" }} />*/}
                            {/*                {errors.firstName && <span className="block text-red-500 text-xs mt-1.5">{errors.firstName}</span>}*/}
                            {/*            </div>*/}
                            {/*            <div className="mb-4">*/}
                            {/*                <label className="block text-[13px] font-semibold mb-[7px]">Last Name</label>*/}
                            {/*                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Mitchell"*/}
                            {/*                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"*/}
                            {/*                       style={{ borderColor: errors.lastName ? "#ef4444" : "#e5e7eb" }} />*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <div className="mb-4">*/}
                            {/*            <label className="block text-[13px] font-semibold mb-[7px]">Email Address</label>*/}
                            {/*            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="sarah@email.com"*/}
                            {/*                   className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"*/}
                            {/*                   style={{ borderColor: errors.email ? "#ef4444" : "#e5e7eb" }} />*/}
                            {/*        </div>*/}
                            {/*        <div className="mb-6">*/}
                            {/*            <label className="block text-[13px] font-semibold mb-[7px]">Phone Number</label>*/}
                            {/*            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0000"*/}
                            {/*                   className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"*/}
                            {/*                   style={{ borderColor: errors.phone ? "#ef4444" : "#e5e7eb" }} />*/}
                            {/*        </div>*/}
                            {/*        <div className="flex gap-4">*/}
                            {/*            <button type="button" onClick={goPrev} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-sm">Back</button>*/}
                            {/*            <button type="button" onClick={goNext} className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm bg-[#0f1c2e]">Continue</button>*/}
                            {/*        </div>*/}
                            {/*    </motion.div>*/}
                            {/*)}*/}

                            {/* STEP 2: Personal Info */}
                            {currentStep === 2 && (
                                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>

                                    {formData.userType === "professional" ? (
                                        // PHARMACY FIELDS
                                        <div className="space-y-4">
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Pharmacy Name</label>
                                                <input type="text" name="pharmacyName"
                                                       value={(formData as any).pharmacyName ?? ""}
                                                       onChange={handleChange}
                                                       placeholder="e.g. MedPlus Pharmacy"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.pharmacyName ? "#ef4444" : "#e5e7eb" }} />
                                                {errors.pharmacyName && <span className="block text-red-500 text-xs mt-1.5">{errors.pharmacyName}</span>}
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Owner / Manager Name</label>
                                                <input type="text" name="firstName"
                                                       value={formData.firstName}
                                                       onChange={handleChange}
                                                       placeholder="e.g. John Silva"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.firstName ? "#ef4444" : "#e5e7eb" }} />
                                                {errors.firstName && <span className="block text-red-500 text-xs mt-1.5">{errors.firstName}</span>}
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Email Address</label>
                                                <input type="email" name="email"
                                                       value={formData.email}
                                                       onChange={handleChange}
                                                       placeholder="pharmacy@email.com"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.email ? "#ef4444" : "#e5e7eb" }} />
                                                {errors.email && <span className="block text-red-500 text-xs mt-1.5">{errors.email}</span>}
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Contact Number</label>
                                                <input type="tel" name="phone"
                                                       value={formData.phone}
                                                       onChange={handleChange}
                                                       placeholder="+94 11 234 5678"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.phone ? "#ef4444" : "#e5e7eb" }} />
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-[13px] font-semibold mb-[7px]">City</label>
                                                <input type="text" name="pharmacyCity"
                                                       value={(formData as any).pharmacyCity ?? ""}
                                                       onChange={handleChange}
                                                       placeholder="e.g. Colombo"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200" />
                                            </div>
                                        </div>
                                    ) : (
                                        // PATIENT / DOCTOR FIELDS (existing)
                                        <div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label className="block text-[13px] font-semibold mb-[7px]">First Name</label>
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Sarah"
                                                           className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                           style={{ borderColor: errors.firstName ? "#ef4444" : "#e5e7eb" }} />
                                                    {errors.firstName && <span className="block text-red-500 text-xs mt-1.5">{errors.firstName}</span>}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-[13px] font-semibold mb-[7px]">Last Name</label>
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Mitchell"
                                                           className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                           style={{ borderColor: errors.lastName ? "#ef4444" : "#e5e7eb" }} />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Email Address</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="sarah@email.com"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.email ? "#ef4444" : "#e5e7eb" }} />
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-[13px] font-semibold mb-[7px]">Phone Number</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0000"
                                                       className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none border-2 border-gray-200"
                                                       style={{ borderColor: errors.phone ? "#ef4444" : "#e5e7eb" }} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-2">
                                        <button type="button" onClick={goPrev} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-sm">Back</button>
                                        <button type="button" onClick={goNext} className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm bg-[#0f1c2e]">Continue</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Security */}
                            {currentStep === 3 && (
                                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
                                    <div className="mb-4">
                                        <label className="block text-[13px] font-semibold mb-[7px]">Password</label>
                                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                                               className="w-full py-3.5 px-4 rounded-[14px] text-sm outline-none border-2 border-gray-200" />
                                        {formData.password && (
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full transition-all" style={{ width: `${passwordStrength}%`, background: strengthColor() }} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase" style={{ color: strengthColor() }}>{strengthText()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-5">
                                        <label className="block text-[13px] font-semibold mb-[7px]">Confirm Password</label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                               className="w-full py-3.5 px-4 rounded-[14px] text-sm outline-none border-2 border-gray-200" />
                                        {errors.confirmPassword && <span className="block text-red-500 text-xs mt-1.5">{errors.confirmPassword}</span>}
                                    </div>
                                    <div className="flex items-start gap-3 mb-6">
                                        <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className="mt-1" />
                                        <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                                            I agree to Medily's terms and privacy policies. I understand my medical data is encrypted.
                                        </label>
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={goPrev} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-sm">Back</button>
                                        <button type="submit" disabled={isLoading} className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm bg-[#0f1c2e]">
                                            {isLoading ? "Creating..." : "Create Account"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </form>

                    {/* Footer */}
                    <div className="mt-7 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">Already have an account? <a href="/login" className="font-bold text-[#7bc5d3]">Log in</a></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;