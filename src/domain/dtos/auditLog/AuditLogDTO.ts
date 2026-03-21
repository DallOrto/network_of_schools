type AuditAction = "CREATE" | "UPDATE" | "DELETE";

type AuditEntity =
  | "NETWORK"
  | "SCHOOL"
  | "TEACHER"
  | "STUDENT"
  | "CLASS"
  | "CLASS_TEACHER"
  | "CLASS_STUDENT"
  | "ADMIN";

interface CreateAuditLogRequest {
  actorId: string;
  actorRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export { AuditAction, AuditEntity, CreateAuditLogRequest };
