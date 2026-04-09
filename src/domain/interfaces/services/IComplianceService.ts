export interface ComplianceCheckRequest {
  name: string;
  document: string;
  birthDate: string;
  schoolId: string;
}

export interface ComplianceCheckResponse {
  complianceId: string;
  approved: boolean;
  reason?: string | null;
  student: {
    id: string;
    name: string;
    document: string;
    schoolId: string;
  };
}

export interface IComplianceService {
  check(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse>;
}
