import { Request, Response } from "express";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { DeleteStudentService } from "../../services/student/DeleteStudentService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class DeleteStudentController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteStudentService = new DeleteStudentService(
      new StudentRepository()
    );

    await deleteStudentService.execute(id);

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "DELETE",
      entity: "STUDENT",
      entityId: id,
    });

    return response.status(204).send();
  }
}

export { DeleteStudentController };
