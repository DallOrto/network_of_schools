import { Request, Response } from "express";
import { UpdateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { UpdateNetworkRepository } from "../../repositories/network/UpdateNetworkRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { UpdateNetworkService } from "../../services/network/UpdateNetworkService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class UpdateNetworkController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name } = request.body;

    const updateNetworkService = new UpdateNetworkService(
      new UpdateNetworkRepository()
    );

    const networkUpdate = await updateNetworkService.execute({ id, name });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "UPDATE",
      entity: "NETWORK",
      entityId: id,
      metadata: { name },
    });

    return response.status(201).json(networkUpdate);
  }
}

export { UpdateNetworkController };
