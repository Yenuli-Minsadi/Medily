import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DOCTOR_CREDENTIALS = {
  email: "doctor@medily.com",
  password: "doctor123",
  role: "doctor",
  name: "Dr. Sarah Mitchell",
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (
      email === DOCTOR_CREDENTIALS.email &&
      password === DOCTOR_CREDENTIALS.password
    ) {
      const userData = {
        email: DOCTOR_CREDENTIALS.email,
        role: DOCTOR_CREDENTIALS.role,
        name: DOCTOR_CREDENTIALS.name,
        isAuthenticated: true,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      console.log("✅ Doctor logged in successfully:", userData);
      navigate("/doctordashboard");
    } else {
      setError("Invalid email or password. Use: doctor@medily.com / doctor123");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Animations & floating-label trick that require real CSS */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, 40px) scale(1.05); }
        }

        .animate-slide-down { animation: slideDown 0.3s ease; }

        .spinner {
          width: 16px; height: 16px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Drifting orb on left panel */
        .value-prop-side::before {
          content: "";
          position: absolute;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(203,213,225,0.12) 0%, transparent 70%);
          border-radius: 50%;
          top: -80px; right: -80px;
          animation: drift 18s ease-in-out infinite;
          z-index: 1;
        }

        /* Floating label behaviour */
        .floating-group input:focus + label,
        .floating-group input:not(:placeholder-shown) + label {
          top: 0.4rem;
          font-size: 0.82rem;
          color: #0f172a;
        }
        .floating-group input:focus {
          border-color: #0f172a !important;
          box-shadow: 0 0 0 3px rgba(15,23,42,0.08);
        }

        /* Hover states */
        .primary-btn:hover:not(:disabled) {
          background: #1e293b !important;
          transform: translateY(-1px);
        }
        .google-btn:hover:not(:disabled) {
          background: #f8f9fc !important;
          border-color: #cbd5e1 !important;
        }
        .forgot-link:hover  { text-decoration: underline; }
        .signup-link:hover  { text-decoration: underline; }
      `}</style>

      {/*
        Matches: grid-template-columns: 1fr minmax(380px, 480px)
        On ≤1024px → single column, left panel hidden
      */}
      <div
        className="min-h-screen"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr minmax(380px, 480px)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f8f9fc",
          color: "#0f172a",
        }}
      >
        {/* ── Left: Value Prop ── */}
        <div
          className="value-prop-side relative overflow-hidden items-center justify-center px-12 py-16 hidden lg:flex"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "white",
          }}
        >
          <div className="relative z-[2] max-w-[480px]">
            {/* Heading */}
            <h2
              className="font-bold mb-5 leading-tight"
              style={{ fontSize: "2.4rem" }}
            >
              Your health, simplified
            </h2>

            {/* Lead */}
            <p
              className="mb-12"
              style={{ fontSize: "1.15rem", lineHeight: 1.6, color: "#cbd5e1" }}
            >
              Securely access records, book appointments, and connect with care
              providers — anytime.
            </p>

            {/* Features */}
            <div className="flex flex-col mb-12" style={{ gap: "1.75rem" }}>
              {[
                {
                  icon: "📋",
                  title: "Digital Records",
                  desc: "Access anytime, anywhere",
                },
                {
                  icon: "🗓️",
                  title: "Instant Booking",
                  desc: "Schedule in seconds",
                },
                {
                  icon: "🔐",
                  title: "Bank-grade Security",
                  desc: "HIPAA compliant & encrypted",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start"
                  style={{ gap: "1.25rem" }}
                >
                  <span
                    className="flex items-center justify-center flex-shrink-0 rounded-xl"
                    style={{
                      fontSize: "2.1rem",
                      width: 52,
                      height: 52,
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ fontSize: "1.15rem" }}
                    >
                      {f.title}
                    </h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.98rem" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo credentials */}
            <div
              className="rounded-xl"
              style={{
                marginTop: "3rem",
                padding: "1.25rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="inline-block rounded-md font-semibold uppercase mb-3"
                style={{
                  padding: "0.35rem 0.75rem",
                  background: "rgba(123,197,211,0.2)",
                  border: "1px solid rgba(123,197,211,0.3)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  color: "#B8E0E8",
                }}
              >
                Demo Account
              </div>
              <div style={{ fontSize: "0.95rem", lineHeight: 1.8 }}>
                <strong className="block mb-2 text-white">Doctor Login:</strong>
                <div
                  style={{
                    color: "#cbd5e1",
                    fontFamily: "'Courier New', monospace",
                    padding: "0.25rem 0",
                  }}
                >
                  📧 doctor@medily.com
                </div>
                <div
                  style={{
                    color: "#cbd5e1",
                    fontFamily: "'Courier New', monospace",
                    padding: "0.25rem 0",
                  }}
                >
                  🔑 doctor123
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Form Side ── */}
        <div className="flex items-center justify-center bg-white p-8">
          <div className="w-full" style={{ maxWidth: 420 }}>
            {/* Logo */}
            <div className="logo">
              <h1
                className="font-bold"
                style={{
                  fontSize: "2.1rem",
                  letterSpacing: "-0.5px",
                  color: "#0f172a",
                  marginBottom: "3rem",
                }}
              >
                Medily
              </h1>
            </div>

            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h2
                className="font-bold"
                style={{ fontSize: "1.95rem", marginBottom: "0.5rem" }}
              >
                Welcome back
              </h2>
              <p style={{ color: "#64748b", fontSize: "1.05rem" }}>
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Error banner */}
              {error && (
                <div
                  className="animate-slide-down flex items-center rounded-xl"
                  style={{
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    background: "#fee2e2",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    fontSize: "0.95rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <svg
                    className="flex-shrink-0"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="16"
                      r="0.5"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {/* Email — floating label */}
              <div
                className="floating-group relative"
                style={{ marginBottom: "1.5rem" }}
              >
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full rounded-xl outline-none transition-all duration-200"
                  style={{
                    padding: "1.25rem 1rem 0.5rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "1.05rem",
                    background: isLoading ? "#f8f9fc" : "#ffffff",
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "text",
                  }}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 pointer-events-none transition-all duration-200"
                  style={{
                    top: "1.1rem",
                    color: "#64748b",
                    fontSize: "1.05rem",
                    transformOrigin: "left",
                  }}
                >
                  Email address
                </label>
              </div>

              {/* Password — floating label */}
              <div
                className="floating-group password-group relative"
                style={{ marginBottom: "0" }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full rounded-xl outline-none transition-all duration-200"
                  style={{
                    padding: "1.25rem 1rem 0.5rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "1.05rem",
                    background: isLoading ? "#f8f9fc" : "#ffffff",
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "text",
                  }}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 pointer-events-none transition-all duration-200"
                  style={{
                    top: "1.1rem",
                    color: "#64748b",
                    fontSize: "1.05rem",
                    transformOrigin: "left",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 bg-transparent border-none cursor-pointer transition-all duration-200"
                  style={{
                    top: "50%",
                    transform: "translateY(-20%)",
                    color: "#64748b",
                    fontSize: "0.95rem",
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Form options */}
              <div
                className="flex justify-between items-center"
                style={{ margin: "1.25rem 0 1.75rem", fontSize: "0.95rem" }}
              >
                <label
                  className="flex items-center select-none"
                  style={{
                    gap: "0.5rem",
                    color: "#64748b",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "#0f172a",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#forgot-password"
                  className="forgot-link font-medium no-underline"
                  style={{ color: "#0f172a" }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign in */}
              <button
                type="submit"
                disabled={isLoading}
                className="primary-btn w-full flex items-center justify-center font-semibold text-white border-none rounded-xl transition-all duration-200"
                style={{
                  gap: "0.5rem",
                  padding: "1.05rem",
                  background: "#0f172a",
                  fontSize: "1.05rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                  borderRadius: "12px",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Divider */}
              <div
                className="flex items-center"
                style={{
                  margin: "1.75rem 0",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                <div
                  className="flex-1 h-px"
                  style={{ background: "#e2e8f0" }}
                />
                <span style={{ padding: "0 1.25rem" }}>or</span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "#e2e8f0" }}
                />
              </div>

              {/* Google */}
              <button
                type="button"
                disabled={isLoading}
                className="google-btn w-full flex items-center justify-center font-medium transition-all duration-200"
                style={{
                  gap: "0.6rem",
                  padding: "1rem",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1.02rem",
                  color: "#333",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Sign up prompt */}
              <p
                className="text-center"
                style={{
                  marginTop: "1.5rem",
                  color: "#64748b",
                  fontSize: "0.98rem",
                }}
              >
                Don't have an account?{" "}
                <a
                  href="#signup"
                  className="signup-link font-semibold no-underline"
                  style={{ color: "#0f172a" }}
                >
                  Create one
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
