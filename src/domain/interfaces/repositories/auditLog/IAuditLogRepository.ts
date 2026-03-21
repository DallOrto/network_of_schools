import { CreateAuditLogRequest } from "../../../dtos/auditLog/AuditLogDTO";

interface IAuditLogRepository {
  create(data: CreateAuditLogRequest): Promise<void>;
}

export { IAuditLogRepository };
