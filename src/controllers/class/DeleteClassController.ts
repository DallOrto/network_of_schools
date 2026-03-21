import { Request, Response } from "express";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { DeleteClassService } from "../../services/class/DeleteClassService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class DeleteClassController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteClassService = new DeleteClassService(
      new ClassRepository()
    );

    await deleteClassService.execute(id);

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "DELETE",
      entity: "CLASS",
      entityId: id,
    });

    return response.status(204).send();
  }
}

export { DeleteClassController };
