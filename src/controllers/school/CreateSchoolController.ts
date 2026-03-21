import { Request, Response } from "express";
import { CreateSchoolRequest } from "../../domain/dtos/school/SchoolDTO";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateSchoolService } from "../../services/school/CreateSchoolService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateSchoolController {
  async handle(request: Request, response: Response) {
    const { name, address, networkId }: CreateSchoolRequest = request.body;

    const createSchoolService = new CreateSchoolService(
      new CreateSchoolRepository(),
      new NetworkRepository()
    );

    const school = await createSchoolService.execute({ name, address, networkId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "SCHOOL",
      entityId: school.id,
      metadata: { name: school.name, networkId },
    });

    return response.status(201).json(school);
  }
}

export { CreateSchoolController };
