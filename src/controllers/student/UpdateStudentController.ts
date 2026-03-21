import { Request, Response } from "express";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { UpdateStudentRepository } from "../../repositories/student/UpdateStudentRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { UpdateStudentService } from "../../services/student/UpdateStudentService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class UpdateStudentController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, document, password, birthDate, schoolId } = request.body;

    const updateStudentService = new UpdateStudentService(
      new UpdateStudentRepository(),
      new CreateSchoolRepository()
    );

    const studentUpdate = await updateStudentService.execute({ id, name, document, password, birthDate, schoolId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "UPDATE",
      entity: "STUDENT",
      entityId: id,
      metadata: { name, schoolId },
    });

    return response.status(201).json(studentUpdate);
  }
}

export { UpdateStudentController };
