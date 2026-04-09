import { Request, Response } from "express";
import { CreateStudentClassRequest } from "../../domain/dtos/studentClass/StudentClassDTO";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { StudentClassRepository } from "../../repositories/studentClass/StudentClassRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateStudentClassService } from "../../services/studentClass/CreateStudentClassService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateStudentClassController {
  async handle(request: Request, response: Response) {
    const { studentId, classId }: CreateStudentClassRequest = request.body;

    const createStudentClassService = new CreateStudentClassService(
      new StudentClassRepository(),
      new StudentRepository()
    );

    await createStudentClassService.execute({ studentId, classId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "CLASS_STUDENT",
      entityId: classId,
      metadata: { studentId },
    });

    return response.status(201).send();
  }
}

export { CreateStudentClassController };
