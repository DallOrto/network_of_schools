import axios from "axios";
import { AppError } from "../../error/AppError";
import {
  ComplianceCheckRequest,
  ComplianceCheckResponse,
  IComplianceService
} from "../../domain/interfaces/services/IComplianceService";

class ComplianceService implements IComplianceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.COMPLIANCE_API_URL!;
  }

  private async getToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/auth/login`,
      {
        document: process.env.COMPLIANCE_API_DOCUMENT,
        password: process.env.COMPLIANCE_API_PASSWORD,
      },
      { timeout: 5000 }
    );
    return response.data.token;
  }

  async check(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse> {
    try {
      const token = await this.getToken();
      const response = await axios.post<ComplianceCheckResponse>(
        `${this.baseUrl}/students/compliance`,
        data,
        {
          timeout: 5000,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new AppError(
          error.response.data?.message || "Compliance check failed",
          error.response.status
        );
      }
      throw new AppError("Compliance service unavailable", 503);
    }
  }
}

export { ComplianceService };
