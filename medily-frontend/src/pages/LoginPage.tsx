import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/Login.css";

// Hardcoded credentials
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

    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if credentials match doctor account
    if (
      email === DOCTOR_CREDENTIALS.email &&
      password === DOCTOR_CREDENTIALS.password
    ) {
      // Store user info in localStorage (or use state management solution)
      const userData = {
        email: DOCTOR_CREDENTIALS.email,
        role: DOCTOR_CREDENTIALS.role,
        name: DOCTOR_CREDENTIALS.name,
        isAuthenticated: true,
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      console.log("✅ Doctor logged in successfully:", userData);
      
      // Redirect to doctor dashboard
      navigate("/doctordashboard");
    } else {
      setError("Invalid email or password. Use: doctor@medily.com / doctor123");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Illustration / Value Prop Side – NOW ON LEFT */}
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
                <p>HIPAA compliant & encrypted</p>
              </div>
            </div>
          </div>

          {/* Demo Credentials Display */}
          <div className="demo-credentials">
            <div className="demo-badge">Demo Account</div>
            <div className="demo-info">
              <strong>Doctor Login:</strong>
              <div>📧 doctor@medily.com</div>
              <div>🔑 doctor123</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side – NOW ON RIGHT */}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none"/>
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

            <button 
              type="submit" 
              className="primary-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
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
            >
              Continue with Google
            </button>

            <p className="signup-prompt">
              Don't have an account? <a href="#signup">Create one</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;