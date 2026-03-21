import { Request, Response } from "express";
import { CreateAdminRequest } from "../../domain/dtos/admin/AdminDTO";
import { AdminRepository } from "../../repositories/admin/AdminRepository";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateAdminService } from "../../services/admin/CreateAdminService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateAdminController {
  async handle(request: Request, response: Response) {
    const { name, document, password, role, networkId, schoolId }: CreateAdminRequest = request.body;

    const createAdminService = new CreateAdminService(
      new AdminRepository(),
      new NetworkRepository(),
      new CreateSchoolRepository(),
    );

    const admin = await createAdminService.execute({
      actorRole: request.user!.role,
      actorNetworkId: request.user!.networkId,
      name,
      document,
      password,
      role,
      networkId,
      schoolId,
    });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "ADMIN",
      entityId: admin.id,
      metadata: { name: admin.name, role: admin.role, networkId, schoolId },
    });

    return response.status(201).json(admin);
  }
}

export { CreateAdminController };
