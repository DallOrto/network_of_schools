export interface LoginRequest {
  document: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
