export interface LoginRequest {
  document: string;
  password: string;
  role: "super_admin" | "network_admin" | "school_admin" | "teacher" | "student";
}

export interface LoginResponse {
  token: string;
}
