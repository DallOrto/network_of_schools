import { Request, Response } from "express";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { UpdateTeacherRepository } from "../../repositories/teacher/UpdateTeacherRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { UpdateTeacherService } from "../../services/teacher/UpdateTeacherService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class UpdateTeacherController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, document, password, birthDate, schoolId } = request.body;

    const updateTeacherService = new UpdateTeacherService(
      new UpdateTeacherRepository(),
      new CreateSchoolRepository()
    );

    const teacherUpdate = await updateTeacherService.execute({ id, name, document, password, birthDate, schoolId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "UPDATE",
      entity: "TEACHER",
      entityId: id,
      metadata: { name, schoolId },
    });

    return response.status(201).json(teacherUpdate);
  }
}

export { UpdateTeacherController };
