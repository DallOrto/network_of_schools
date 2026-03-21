import { Request, Response } from "express";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";
import { UpdateSchoolRepository } from "../../repositories/school/UpdateSchoolRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { UpdateSchoolService } from "../../services/school/UpdateSchoolService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class UpdateSchoolController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, address, networkId } = request.body;

    const updateSchoolService = new UpdateSchoolService(
      new UpdateSchoolRepository(),
      new NetworkRepository()
    );

    const schoolUpdate = await updateSchoolService.execute({ id, name, address, networkId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "UPDATE",
      entity: "SCHOOL",
      entityId: id,
      metadata: { name, address, networkId },
    });

    return response.status(201).json(schoolUpdate);
  }
}

export { UpdateSchoolController };
