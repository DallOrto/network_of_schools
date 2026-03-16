export interface ComplianceCheckRequest {
  name: string;
  document: string;
  password: string;
  birthDate: string;
  schoolId: string;
}

export interface ComplianceCheckResponse {
  approved: boolean;
  reason?: string;
}

export interface IComplianceService {
  check(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse>;
}
