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

  async check(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse> {
    try {
      const response = await axios.post<ComplianceCheckResponse>(
        `${this.baseUrl}/students/compliance`,
        data,
        {
          headers: { "x-api-key": process.env.INTERNAL_API_KEY },
          timeout: 5000,
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
