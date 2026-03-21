export interface AuthUser {
  id: string;
  document: string;
  password: string;
  role?: string;
  schoolId?: string;
  networkId?: string;
}

export interface IAuthRepository {
  findTeacherByDocument(document: string): Promise<AuthUser | null>;
  findStudentByDocument(document: string): Promise<AuthUser | null>;
  findAdminByDocument(document: string): Promise<AuthUser | null>;
}
