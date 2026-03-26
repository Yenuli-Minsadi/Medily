import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
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
                    <button className="btn-login" onClick={() => navigate("/login")}>
                        Log in
                    </button>
                    <button className="btn-signup" onClick={() => navigate("/signup")}>
                        Sign up
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;