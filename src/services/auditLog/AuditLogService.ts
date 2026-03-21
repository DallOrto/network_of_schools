import { CreateAuditLogRequest } from "../../domain/dtos/auditLog/AuditLogDTO";
import { IAuditLogRepository } from "../../domain/interfaces/repositories/auditLog/IAuditLogRepository";

class AuditLogService {
  private repository: IAuditLogRepository;

  constructor(repository: IAuditLogRepository) {
    this.repository = repository;
  }

  async log(data: CreateAuditLogRequest): Promise<void> {
    try {
      await this.repository.create(data);
    } catch (error) {
      console.error("[AuditLog] Failed to register audit entry:", error);
    }
  }
}

export { AuditLogService };
