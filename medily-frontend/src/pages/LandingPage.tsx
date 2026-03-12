import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup"); // You can create a signup page later
  };

  const handleCreateAccountClick = () => {
    navigate("/signup"); // Navigate to signup page
  };

  const handleHaveAccountClick = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Medily</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#doctors">For Doctors</a>
            <a href="#feed">Feed</a>
          </div>
          <div className="nav-auth">
            <button className="btn-login" onClick={handleLoginClick}>
              Log in
            </button>
            <button className="btn-signup" onClick={handleSignupClick}>
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            Connect with a doc and post your recovery journey
          </div>

          <h1 className="hero-title">
            Your Secure Digital Medical Identity
            <br />
            Linking Most of Your Healthcare needs
          </h1>

          <p className="hero-subtitle">
            Store prescriptions, book appointments, and share records with
            doctors
            <br />
            instantly, your complete healthcare in one secure app.
          </p>

          {/* CTA Buttons */}
          <div className="hero-btns">
            <button
              className="btn-create-account"
              onClick={handleCreateAccountClick}
            >
              Create your Medical Identity
            </button>
            <button
              className="btn-have-account"
              onClick={handleHaveAccountClick}
            >
              I already have an account
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <p className="section-label">FEATURES</p>
          <h2 className="section-title">
            Everything you need for modern
            <br />
            healthcare
          </h2>
          <p className="section-subtitle">
            A comprehensive platform designed to simplify every aspect of
            <br />
            your medical journey.
          </p>

          <div className="features-grid">
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
            <div className="feature-card"></div>
          </div>
        </div>
      </section>

      {/* Secure Sharing Section */}
      <section className="secure-sharing-section" id="security">
        <div className="section-container">
          <p className="section-label">SECURE SHARING</p>
          <h2 className="section-title">Share records your way, securely</h2>
          <p className="section-subtitle">
            You control who sees your data, for how long, and can revoke access
            instantly.
          </p>

          <div className="sharing-steps">
            <div className="sharing-step">
              <div className="step-circle"></div>
              <p className="step-label">Select Record</p>
            </div>
            <div className="sharing-step">
              <div className="step-circle"></div>
              <p className="step-label">Generate PIN</p>
            </div>
            <div className="sharing-step">
              <div className="step-circle"></div>
              <p className="step-label">Share Securely</p>
            </div>
            <div className="sharing-step">
              <div className="step-circle"></div>
              <p className="step-label">Full Consent</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Healthcare Professionals Section */}
      <section className="healthcare-professionals-section" id="doctors">
        <div className="section-container">
          <p className="section-label">FOR HEALTHCARE PROFESSIONALS</p>
          <h2 className="section-title">Tools build for how you work</h2>
          <p className="section-subtitle">
            Streamline your practice with digital prescriptions, consent-based
            record access,
            <br />
            and smart scheduling — all in one distraction-free interface.
          </p>

          <div className="professionals-content">
            <div className="professionals-left">
              <button className="btn-professional">
                Join as a Healthcare Professional
              </button>
            </div>
            <div className="professionals-right">
              <div className="professional-feature-card">
                Digital Prescriptions
              </div>
              <div className="professional-feature-card">
                Content-Based Access
              </div>
              <div className="professional-feature-card">
                Appointment
                <br />
                Management
              </div>
              <div className="professional-feature-card">Quality Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Feed Section */}
      <section className="medical-feed-section" id="feed">
        <div className="section-container">
          <p className="section-label">MEDICAL FEED</p>
          <h2 className="section-title">
            Professional medical field that you can trust
          </h2>
          <p className="section-subtitle">
            Doctor-verified health tips, recovery stories, and announcements —
            no ads, no noise.
          </p>

          <div className="feed-cards">
            <div className="feed-card"></div>
            <div className="feed-card"></div>
            <div className="feed-card"></div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <h2 className="final-cta-title">
            Healthcare connected -<br />
            Securely.
          </h2>
          <p className="final-cta-subtitle">
            Join thousands of patients and healthcare professionals who trust
            Medily with their most important data.
          </p>
          <button className="btn-final-cta" onClick={handleCreateAccountClick}>
            Get Started with Medily →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-column footer-brand">
              <h3 className="footer-logo">Medily</h3>
              <p className="footer-tagline">
                Your complete healthcare platform, connecting patients and
                professionals securely.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  Twitter
                </a>
                <a href="#" className="social-link">
                  LinkedIn
                </a>
                <a href="#" className="social-link">
                  Facebook
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#security">Security</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#updates">Updates</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">For Professionals</h4>
              <ul className="footer-links">
                <li>
                  <a href="#doctors">For Doctors</a>
                </li>
                <li>
                  <a href="#clinics">For Clinics</a>
                </li>
                <li>
                  <a href="#pharmacies">For Pharmacies</a>
                </li>
                <li>
                  <a href="#api">API Access</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-links">
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#hipaa">HIPAA Compliance</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 Medily. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
