import { Request, Response } from "express";
import { CreateTeacherClassRequest } from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { TeacherRepository } from "../../repositories/teacher/TeacherRepository";
import { TeacherClassRepository } from "../../repositories/teacherClass/TeacherClassRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateTeacherClassService } from "../../services/teacherClass/CreateTeacherClassService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateTeacherClassController {
  async handle(request: Request, response: Response) {
    const { teacherId, classId }: CreateTeacherClassRequest = request.body;

    const createTeacherClassService = new CreateTeacherClassService(
      new TeacherClassRepository(),
      new TeacherRepository(),
      new ClassRepository()
    );

    await createTeacherClassService.execute({ teacherId, classId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "CLASS_TEACHER",
      entityId: classId,
      metadata: { teacherId },
    });

    return response.status(201).send();
  }
}

export { CreateTeacherClassController };
