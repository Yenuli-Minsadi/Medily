import React from "react";
import SectionBadge from "../atoms/SectionBadge";
import SectionHeading from "../atoms/SectionHeading";

const steps = [
    {
        label: "Select Record",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        label: "Generate PIN",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
        ),
    },
    {
        label: "Share Securely",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
        ),
    },
    {
        label: "Full Consent",
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
    },
];

const ArrowRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="step-arrow">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const SecureSharingSection: React.FC = () => {
    return (
        <section className="secure-sharing-section" id="security">
            <div className="section-container">
                <SectionBadge text="SECURE SHARING" />
                <SectionHeading
                    title="Share records your way, securely"
                    subtitle="You control who sees your data, for how long, and can revoke access instantly."
                />

                <div className="sharing-steps">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.label}>
                            <div className="sharing-step">
                                <div className="step-circle">
                                    {step.icon}
                                </div>
                                <p className="step-label">{step.label}</p>
                            </div>
                            {index < steps.length - 1 && <ArrowRight />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SecureSharingSection;