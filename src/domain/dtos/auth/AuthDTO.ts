export interface LoginRequest {
  document: string;
  password: string;
  role: "teacher" | "student";
}

export interface LoginResponse {
  token: string;
}
