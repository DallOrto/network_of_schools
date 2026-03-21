import { Request, Response } from "express";
import { UpdateClassRepository } from "../../repositories/class/UpdateClassRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { UpdateClassService } from "../../services/class/UpdateClassService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class UpdateClassController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, classDay, startTime, endTime, schoolId, maxStudents: maxStudentsRaw } = request.body;
    const maxStudents = Number(maxStudentsRaw);

    const updateClassService = new UpdateClassService(
      new UpdateClassRepository(),
      new CreateSchoolRepository()
    );

    const classUpdate = await updateClassService.execute({ id, name, classDay, startTime, endTime, schoolId, maxStudents });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "UPDATE",
      entity: "CLASS",
      entityId: id,
      metadata: { name, schoolId },
    });

    return response.status(201).json(classUpdate);
  }
}

export { UpdateClassController };
