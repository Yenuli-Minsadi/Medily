import type { AuthResponse } from "../api/authApi";

export const saveAuth = (data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);
    localStorage.setItem("userId", String(data.userId));
    localStorage.setItem("accountStatus", data.accountStatus ?? "ACTIVE");
    localStorage.setItem("isSubscribed", String(data.isSubscribed ?? false));
    localStorage.setItem("isSubscribed", String(data.isSubscribed ?? false));
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
};

export const getToken   = () => localStorage.getItem("token");
export const getRole    = () => localStorage.getItem("role");
export const getName    = () => localStorage.getItem("name");
export const getUserId  = () => localStorage.getItem("userId");
export const isLoggedIn = () => !!localStorage.getItem("token");

export const redirectByRole = (role: string): string => {
    const routes: Record<string, string> = {
        ADMIN:      "/admindashboard",
        DOCTOR:     "/doctordashboard",
        PATIENT:    "/patientdashboard",
        PHARMACIST: "/pharmacydashboard",
    };
    return routes[role] ?? "/";
};