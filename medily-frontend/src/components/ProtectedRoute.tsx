import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../lib/auth";

interface Props {
    children: React.ReactNode;
    allowedRole: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRole }) => {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (getRole() !== allowedRole) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

export default ProtectedRoute;