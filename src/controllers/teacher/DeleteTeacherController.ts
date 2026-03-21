import { Request, Response } from "express";
import { TeacherRepository } from "../../repositories/teacher/TeacherRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { DeleteTeacherService } from "../../services/teacher/DeleteTeacherService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class DeleteTeacherController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteTeacherService = new DeleteTeacherService(
      new TeacherRepository()
    );

    await deleteTeacherService.execute(id);

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "DELETE",
      entity: "TEACHER",
      entityId: id,
    });

    return response.status(204).send();
  }
}

export { DeleteTeacherController };
