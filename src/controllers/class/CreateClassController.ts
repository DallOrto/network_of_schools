import { Request, Response } from "express";
import { CreateClassRequest } from "../../domain/dtos/class/ClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateClassService } from "../../services/class/CreateClassService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateClassController {
  async handle(request: Request, response: Response) {
    const { name, classDay, startTime, endTime, schoolId, maxStudents: maxStudentsRaw } = request.body;
    const maxStudents = Number(maxStudentsRaw);

    const createClassService = new CreateClassService(
      new ClassRepository(),
      new CreateSchoolRepository()
    );

    const classRegister = await createClassService.execute({ name, classDay, startTime, endTime, schoolId, maxStudents });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "CLASS",
      entityId: classRegister.id,
      metadata: { name: classRegister.name, schoolId },
    });

    return response.status(201).json(classRegister);
  }
}

export { CreateClassController };
