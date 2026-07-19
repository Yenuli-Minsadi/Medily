import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { loginApi } from "../api/authApi";
import { saveAuth, redirectByRole } from "../lib/auth";
import { useNavigate } from "react-router-dom";

// import credentials from constants for now
// import {
//   DOCTOR_CREDENTIALS,
//   PATIENT_CREDENTIALS,
//   PHARMACIST_CREDENTIALS,
//   ADMIN_CREDENTIALS,
// } from "../constants/roles/roles";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // User handler
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);
  //
  //   await new Promise((resolve) => setTimeout(resolve, 800));
  //
  //   if (
  //     email === DOCTOR_CREDENTIALS.email &&
  //     password === DOCTOR_CREDENTIALS.password
  //   ) {
  //     const userData = {
  //       email: DOCTOR_CREDENTIALS.email,
  //       role: DOCTOR_CREDENTIALS.role,
  //       name: DOCTOR_CREDENTIALS.name,
  //       isAuthenticated: true,
  //     };
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     if (rememberMe) localStorage.setItem("rememberMe", "true");
  //     navigate("/doctordashboard");
  //   } else if (
  //     email === PATIENT_CREDENTIALS.email &&
  //     password === PATIENT_CREDENTIALS.password
  //   ) {
  //     const userData = {
  //       email: PATIENT_CREDENTIALS.email,
  //       role: PATIENT_CREDENTIALS.role,
  //       name: PATIENT_CREDENTIALS.name,
  //       isAuthenticated: true,
  //     };
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     if (rememberMe) localStorage.setItem("rememberMe", "true");
  //     navigate("/patientdashboard");
  //   } else if (
  //     email === PHARMACIST_CREDENTIALS.email &&
  //     password === PHARMACIST_CREDENTIALS.password
  //   ) {
  //     const userData = {
  //       email: PHARMACIST_CREDENTIALS.email,
  //       role: PHARMACIST_CREDENTIALS.role,
  //       name: PHARMACIST_CREDENTIALS.name,
  //       isAuthenticated: true,
  //     };
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     if (rememberMe) localStorage.setItem("rememberMe", "true");
  //     navigate("/pharmacydashboard");
  //   } else if (
  //     email === ADMIN_CREDENTIALS.email &&
  //     password === ADMIN_CREDENTIALS.password
  //   ) {
  //       const userData = {
  //         email: ADMIN_CREDENTIALS.email,
  //         role: ADMIN_CREDENTIALS.role,
  //         name: ADMIN_CREDENTIALS.name,
  //         isAuthenticated: true,
  //       };
  //       localStorage.setItem("user", JSON.stringify(userData));
  //       if (rememberMe) localStorage.setItem("rememberMe", "true");
  //       navigate("/admindashboard");
  //   } else {
  //     setError("Invalid email or password. Use the demo credentials below.");
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginApi({ email, password });
      console.log("DATA:", data);
      console.log("TOKEN:", data?.token);
      console.log("ROLE:", data?.role);
      saveAuth(data);
      console.log("LS TOKEN:", localStorage.getItem("token"));
      console.log("LS ROLE:", localStorage.getItem("role"));
      // navigate(redirectByRole(data.role));

      if (data.role === "DOCTOR" || data.role === "PHARMACIST") {
        if (data.accountStatus === "PENDING") {
          navigate("/pending-verification");
          return;
        }
        if (data.role === "DOCTOR" && !data.isSubscribed) {
          navigate("/doctor-subscription");
          return;
        }
      }
      navigate(redirectByRole(data.role));

    } catch (err: any) {
      console.error("ERR:", err);
      setError(err.response?.data?.message ?? "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  // Add this function inside the Login component, after handleSubmit:
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Quick-fill helpers
  // const fillDoctor = () => {
  //   setEmail(DOCTOR_CREDENTIALS.email);
  //   setPassword(DOCTOR_CREDENTIALS.password);
  //   setError("");
  // };
  //
  // const fillPatient = () => {
  //   setEmail(PATIENT_CREDENTIALS.email);
  //   setPassword(PATIENT_CREDENTIALS.password);
  //   setError("");
  // };
  //
  // const fillPharmacist = () => {
  //   setEmail(PHARMACIST_CREDENTIALS.email);
  //   setPassword(PHARMACIST_CREDENTIALS.password);
  //   setError("");
  // };
  //
  // const fillAdmin = () => {
  //   setEmail(ADMIN_CREDENTIALS.email);
  //   setPassword(ADMIN_CREDENTIALS.password);
  //   setError("");
  // };

  return (
    <div className="login-page">
      {/* Value Prop Side (Left) */}
      <div className="value-prop-side">
        <div className="value-content">
          <h2>Your health, simplified</h2>
          <p className="lead">
            Securely access records, book appointments, and connect with care
            providers — anytime.
          </p>

          <div className="features">
            <div className="feature">
              <span className="icon">📋</span>
              <div>
                <h4>Digital Records</h4>
                <p>Access anytime, anywhere</p>
              </div>
            </div>
            <div className="feature">
              <span className="icon">🗓️</span>
              <div>
                <h4>Instant Booking</h4>
                <p>Schedule in seconds</p>
              </div>
            </div>
            <div className="feature">
              <span className="icon">🔐</span>
              <div>
                <h4>Bank-grade Security</h4>
                <p>HIPAA compliant &amp; encrypted</p>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
      {/*    <div className="demo-credentials">*/}
      {/*      <div className="demo-badge">Demo Accounts</div>*/}

      {/*      /!* Doctor *!/*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        className="demo-card"*/}
      {/*        onClick={fillDoctor}*/}
      {/*        title="Click to auto-fill"*/}
      {/*      >*/}
      {/*        <div className="demo-card-header">*/}
      {/*          <span className="demo-role-icon">🩺</span>*/}
      {/*          <span className="demo-role-label">Doctor</span>*/}
      {/*          <span className="demo-autofill-hint">Click to fill →</span>*/}
      {/*        </div>*/}
      {/*        <div className="demo-info">*/}
      {/*          <div>📧 {DOCTOR_CREDENTIALS.email}</div>*/}
      {/*          <div>🔑 {DOCTOR_CREDENTIALS.password}</div>*/}
      {/*        </div>*/}
      {/*      </button>*/}

      {/*      /!* Patient *!/*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        className="demo-card"*/}
      {/*        onClick={fillPatient}*/}
      {/*        title="Click to auto-fill"*/}
      {/*      >*/}
      {/*        <div className="demo-card-header">*/}
      {/*          <span className="demo-role-icon">🧑‍💼</span>*/}
      {/*          <span className="demo-role-label">Patient</span>*/}
      {/*          <span className="demo-autofill-hint">Click to fill →</span>*/}
      {/*        </div>*/}
      {/*        <div className="demo-info">*/}
      {/*          <div>📧 {PATIENT_CREDENTIALS.email}</div>*/}
      {/*          <div>🔑 {PATIENT_CREDENTIALS.password}</div>*/}
      {/*        </div>*/}
      {/*      </button>*/}

      {/*      /!* Pharmacist *!/*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        className="demo-card demo-card--pharmacy"*/}
      {/*        onClick={fillPharmacist}*/}
      {/*        title="Click to auto-fill"*/}
      {/*      >*/}
      {/*        <div className="demo-card-header">*/}
      {/*          <span className="demo-role-icon">💊</span>*/}
      {/*          <span className="demo-role-label">Pharmacist</span>*/}
      {/*          <span className="demo-autofill-hint">Click to fill →</span>*/}
      {/*        </div>*/}
      {/*        <div className="demo-info">*/}
      {/*          <div>📧 {PHARMACIST_CREDENTIALS.email}</div>*/}
      {/*          <div>🔑 {PHARMACIST_CREDENTIALS.password}</div>*/}
      {/*        </div>*/}
      {/*      </button>*/}

      {/*      /!* Admin *!/*/}
      {/*      <button*/}
      {/*          type="button"*/}
      {/*          className="demo-card demo-card--admin"*/}
      {/*          onClick={fillAdmin}*/}
      {/*          title="Click to auto-fill"*/}
      {/*      >*/}
      {/*        <div className="demo-card-header">*/}
      {/*          <span className="demo-role-icon">*</span>*/}
      {/*          <span className="demo-role-label">Admin</span>*/}
      {/*          <span className="demo-autofill-hint">Click to fill →</span>*/}
      {/*        </div>*/}
      {/*        <div className="demo-info">*/}
      {/*          <div>📧 {ADMIN_CREDENTIALS.email}</div>*/}
      {/*          <div>🔑 {ADMIN_CREDENTIALS.password}</div>*/}
      {/*        </div>*/}
      {/*      </button>*/}
      {/*    </div>*/}
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="login-form-side">
        <div className="form-container">
          <div className="logo">
            <h1>Medily</h1>
          </div>

          <div className="header">
            <h2>Welcome back</h2>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-banner">
                <svg
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

            <div className="floating-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                autoComplete="email"
                disabled={isLoading}
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="floating-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="form-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>

              <a href="#forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button
                type="button"
                className="google-btn"
                disabled={isLoading}
                onClick={handleGoogleLogin}>
              <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  style={{ width: 18, height: 18 }} />
              Continue with Google
            </button>

            <p className="signup-prompt">
              Don't have an account? <a href="/signup">Create one</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
