import { createContext, useContext, useState, useEffect } from "react";
import { clearAuth, getRole, getName, getUserId, isLoggedIn } from "../lib/auth";

interface AuthUser {
    name: string;
    role: string;
    userId: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    logout: () => {},
    refreshUser: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

function buildUser(): AuthUser | null {
    if (!isLoggedIn()) return null;
    return {
        name:   getName()   ?? "",
        role:   getRole()   ?? "",
        userId: getUserId() ?? "",
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(buildUser);

    // Re-sync if localStorage changes in another tab
    useEffect(() => {
        const onStorage = () => setUser(buildUser());
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const logout = () => {
        clearAuth();
        setUser(null);
        window.location.href = "/login";
    };

    const refreshUser = () => setUser(buildUser());

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
    return useContext(AuthContext);
}