// pages/OAuth2RedirectHandler.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuth } from "../lib/auth";
import { redirectByRole } from "../lib/auth";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(location.search);

        const token         = params.get("token");
        const role          = params.get("role");
        const name          = params.get("name");
        const userId        = params.get("userId");
        const accountStatus = params.get("accountStatus");
        const isSubscribed  = params.get("isSubscribed");
        const email         = params.get("email");
        const newUser       = params.get("newUser");

        if (!token) {
            navigate("/login?error=oauth_failed");
            return;
        }

        // Save all auth data
        saveAuth({
            token,
            role:          role ?? "PATIENT",
            name:          name ?? "",
            userId:        parseInt(userId ?? "0"),
            accountStatus: accountStatus ?? "ACTIVE",
            isSubscribed:  isSubscribed === "true",
            email:         email ?? "",
        });

        // New user — ask them to pick role
        if (newUser === "true") {
            navigate("/complete-profile");
            return;
        }

        // Redirect based on role and status
        if (role === "DOCTOR") {
            if (accountStatus === "PENDING") {
                navigate("/pending-verification");
                return;
            }
            if (isSubscribed !== "true") {
                navigate("/doctor-subscription");
                return;
            }
            navigate("/doctordashboard");
            return;
        }

        if (role === "PHARMACIST") {
            if (accountStatus === "PENDING") {
                navigate("/pending-verification");
                return;
            }
            navigate("/pharmacydashboard");
            return;
        }

        // Patient, Admin, etc.
        navigate(redirectByRole(role ?? "PATIENT"));

    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center"
             style={{ background: "#0a1929" }}>
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                     style={{ borderColor: "#7bc5d3", borderTopColor: "transparent" }} />
                <p className="text-white/60 text-sm font-medium">
                    Completing sign in...
                </p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;