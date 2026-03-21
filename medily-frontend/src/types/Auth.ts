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
}

export interface FormErrors {
  [key: string]: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  password: string;
}
