export interface ComplianceCheckRequest {
  name: string;
  document: string;
  birthDate: string;
  schoolId: string;
  callbackUrl: string;
}

export interface ComplianceCheckResponse {
  jobId: string;
  status: 'PROCESSING';
}

export interface IComplianceService {
  check(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse>;
}
