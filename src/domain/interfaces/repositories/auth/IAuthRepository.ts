export interface AuthUser {
  id: string;
  document: string;
  password: string;
}

export interface IAuthRepository {
  findTeacherByDocument(document: string): Promise<AuthUser | null>;
  findStudentByDocument(document: string): Promise<AuthUser | null>;
}
