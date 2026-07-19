import api from "./api";

export type AuthResponse = {
    token: string;
    role: string;
    name: string;
    userId: number;
    accountStatus: string;
    isSubscribed: boolean;
    email?: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    role: string;
    specialization?: string;
    medicalRegNumber?: string;
    pharmacyLicenseNumber?: string;
};

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>("/api/auth/login", data);
    return response.data.data;
};

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>("/api/auth/register", data);
    return response.data.data;
};