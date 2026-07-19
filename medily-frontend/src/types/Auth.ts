export interface UserData {
  email: string;
  role: string;
  name: string;
  isAuthenticated: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  specialization?: string;        // ADD
  medicalRegNumber?: string;       // ADD
  pharmacyLicenseNumber?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// UPDATE - this is what the backend actually returns now
export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  userId: number;
  accountStatus: string;   // ADD
  isSubscribed: boolean;   // ADD
  email?: string;          // ADD
}

// Keep for backwards compat but point to AuthResponse
export interface LoginResponse extends AuthResponse {}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  specialization?: string;        // ADD
  medicalRegNumber?: string;       // ADD
  pharmacyLicenseNumber?: string;  // ADD
}