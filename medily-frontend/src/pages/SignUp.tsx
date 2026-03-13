import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const roleOptions = [
  {
    value: "patient",
    label: "Patient",
    description: "Manage your health records & appointments",
  },
  {
    value: "doctor",
    label: "Doctor",
    description: "Access patient records & manage consultations",
  },
  {
    value: "hospital",
    label: "Hospital / Clinic",
    description: "Coordinate staff, patients & operations",
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
    password: "",
    confirmPassword: "",
    terms: false,
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
    if (value) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "terms" && typeof formData[key as keyof FormData] === "string") {
        const error = validateField(key, formData[key as keyof FormData] as string);
        if (error) newErrors[key] = error;
      }
    });
    if (!formData.terms) newErrors.terms = "You must agree to the terms";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Submitted:", formData);
    setIsLoading(false);
  };

  const goNext = () => {
    if (currentStep === 1) {
      if (!formData.userType) { setErrors({ userType: "Please select your role to continue" }); return; }
      setCurrentStep(2); setErrors({});
    } else if (currentStep === 2) {
      const errs: FormErrors = {};
      ["firstName", "lastName", "email", "phone"].forEach((f) => {
        const val = formData[f as keyof FormData] as string;
        const err = validateField(f, val);
        if (err || !val) errs[f] = err || "This field is required";
      });
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
    { title: "Who are you joining as?", sub: "Choose your role so we can tailor your experience from day one" },
    { title: "Tell us about yourself", sub: "Your details help us personalise your healthcare profile" },
    { title: "Secure your account", sub: "Set up a strong password to protect your medical data" },
  ];
  const selectedRole = roleOptions.find((r) => r.value === formData.userType);

  const progressWidth = currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden" style={{ background: "#0a1929", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Background orbs */}
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

          {/* Progress */}
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
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-4 py-[7px] rounded-3xl text-xs font-semibold" style={{ background: "linear-gradient(90deg,#e8d5f2,#b8e0e8)", color: "#0f1c2e" }}>
                ★ Trusted by 10,000+ healthcare professionals
              </div>
            </div>
            <h1 className="text-[26px] font-bold leading-tight mb-1.5" style={{ color: "#1a1a1a" }}>
              {stepHeaders[currentStep - 1].title}
            </h1>
            <p className="text-sm leading-[1.55] text-gray-500 m-0">
              {stepHeaders[currentStep - 1].sub}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Role Cards ── */}
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
                          <div className="w-[22px] h-[22px] flex-shrink-0 rounded-full flex items-center justify-center"
                            style={{
                              border: isSelected ? "none" : "2px solid #e5e7eb",
                              background: isSelected ? "linear-gradient(135deg,#7bc5d3,#c5a3e0)" : "transparent",
                            }}>
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.userType && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.userType}</span>}

                  <div className="flex justify-center mt-7">
                    <motion.button type="button" onClick={goNext}
                      className="min-w-[200px] py-3.5 px-6 border-none rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #0f1c2e 0%, #1a2942 100%)" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Continue
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[13px] text-gray-400">Or sign up with</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="flex justify-center mb-2">
                    <button type="button"
                      className="min-w-[220px] py-3.5 px-8 border-2 border-gray-200 bg-white rounded-[14px] text-[15px] font-semibold text-[#1a1a1a] cursor-pointer flex items-center gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Personal Info ── */}
              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-5 text-[13px]"
                    style={{ background: "rgba(123,197,211,0.08)", border: "1px solid rgba(123,197,211,0.25)" }}>
                    <span className="text-gray-500">Signing up as</span>
                    <span className="font-bold flex-1" style={{ color: "#0f1c2e" }}>{selectedRole?.label}</span>
                    <button type="button" onClick={() => { setCurrentStep(1); setErrors({}); }}
                      className="bg-transparent border-none cursor-pointer text-[13px] font-semibold p-0" style={{ color: "#7bc5d3" }}>
                      Change
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Sarah"
                        className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.firstName ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                      {errors.firstName && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.firstName}</span>}
                    </div>
                    <div className="mb-4">
                      <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Mitchell"
                        className="w-full py-3.5 px-4 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.lastName ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                      {errors.lastName && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="sarah.mitchell@email.com"
                        className="w-full py-3.5 pl-12 pr-4 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.email ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                    </div>
                    {errors.email && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.email}</span>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
                        className="w-full py-3.5 pl-12 pr-4 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.phone ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                    </div>
                    {errors.phone && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</span>}
                  </div>

                  <div className="grid gap-4" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <motion.button type="button" onClick={goPrev}
                      className="py-3.5 px-5 border-2 border-gray-200 rounded-[14px] text-[15px] font-semibold text-[#1a1a1a] bg-white flex items-center justify-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Back
                    </motion.button>
                    <motion.button type="button" onClick={goNext}
                      className="py-3.5 px-6 border-none rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #0f1c2e 0%, #1a2942 100%)" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Continue
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Account Setup ── */}
              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
                  <div className="mb-4">
                    <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password"
                        className="w-full py-3.5 pl-12 pr-12 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.password ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex">
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-[5px] bg-gray-200 rounded-[3px] overflow-hidden">
                          <motion.div className="h-full rounded-[3px]"
                            style={{ background: strengthColor() }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }} />
                        </div>
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: strengthColor() }}>
                          {strengthText()}
                        </span>
                      </div>
                    )}
                    {errors.password && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.password}</span>}
                  </div>

                  <div className="mb-5">
                    <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: "#1a1a1a" }}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password"
                        className="w-full py-3.5 pl-12 pr-4 rounded-[14px] text-sm bg-white outline-none box-border transition-colors duration-200"
                        style={{ border: `2px solid ${errors.confirmPassword ? "#ef4444" : "#e5e7eb"}`, color: "#1a1a1a" }} />
                    </div>
                    {errors.confirmPassword && <span className="block text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</span>}
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange}
                      className="w-[18px] h-[18px] mt-0.5 cursor-pointer flex-shrink-0"
                      style={{ accentColor: "#7bc5d3" }} />
                    <label htmlFor="terms" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer">
                      I agree to Medily's{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold no-underline" style={{ color: "#7bc5d3" }}>Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold no-underline" style={{ color: "#7bc5d3" }}>Privacy Policy</a>.
                      {" "}I understand my data is encrypted and HIPAA compliant.
                    </label>
                  </div>
                  {errors.terms && <span className="block text-red-500 text-xs mb-4 font-medium">{errors.terms}</span>}

                  <div className="grid gap-4" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <motion.button type="button" onClick={goPrev}
                      className="py-3.5 px-5 border-2 border-gray-200 rounded-[14px] text-[15px] font-semibold text-[#1a1a1a] bg-white flex items-center justify-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Back
                    </motion.button>
                    <motion.button type="submit"
                      className="py-3.5 px-6 border-none rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-opacity"
                      style={{ background: "linear-gradient(135deg, #0f1c2e 0%, #1a2942 100%)", opacity: isLoading ? 0.7 : 1 }}
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                      {isLoading ? "Creating..." : (
                        <>
                          Create Account{" "}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Footer */}
          <div className="mt-7">
            <p className="text-center text-sm text-gray-500 mb-5">
              Already have an account?{" "}
              <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold no-underline" style={{ color: "#7bc5d3" }}>Log in</a>
            </p>
            <div className="flex items-center justify-center gap-5 pt-5 border-t border-gray-200 flex-wrap">
              {[
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                  label: "256-bit Encrypted",
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
                  label: "HIPAA Compliant",
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                  label: "99.9% Uptime",
                },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#b8e0e8,#e8d5f2)", color: "#0f1c2e" }}>
                    {b.icon}
                  </div>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;