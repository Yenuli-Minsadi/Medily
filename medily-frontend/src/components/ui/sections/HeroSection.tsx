import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
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
                    Store prescriptions, book appointments, and share records with doctors
                    <br />
                    instantly, your complete healthcare in one secure app.
                </p>

                <div className="hero-btns">
                    <Button className="btn-create-account" onClick={() => navigate("/signup")}>
                        Create your Medical Identity
                    </Button>
                    <Button className="btn-have-account" onClick={() => navigate("/login")}>
                        I already have an account
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;