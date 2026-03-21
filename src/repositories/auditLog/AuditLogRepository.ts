import { Prisma } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateAuditLogRequest } from "../../domain/dtos/auditLog/AuditLogDTO";
import { IAuditLogRepository } from "../../domain/interfaces/repositories/auditLog/IAuditLogRepository";

class AuditLogRepository implements IAuditLogRepository {
  async create(data: CreateAuditLogRequest): Promise<void> {
    await prismaDB.auditLog.create({
      data: {
        ...data,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}

export { AuditLogRepository };
