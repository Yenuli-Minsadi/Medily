import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

const CTASection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="final-cta-section">
            <div className="section-container">
                <h2 className="final-cta-title">
                    Healthcare connected -<br />Securely.
                </h2>
                <p className="final-cta-subtitle">
                    Join thousands of patients and healthcare professionals who trust
                    Medily with their most important data.
                </p>
                <Button variant="primary" onClick={() => navigate("/signup")}>
                    Get Started with Medily →
                </Button>
            </div>
        </section>
    );
};

export default CTASection;