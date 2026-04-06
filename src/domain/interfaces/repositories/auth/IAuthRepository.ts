export interface AuthUser {
  id: string;
  document: string;
  password: string;
  role: string;
  schoolId?: string;
  networkId?: string;
}

export interface IAuthRepository {
  findByDocument(document: string): Promise<AuthUser | null>;
}
