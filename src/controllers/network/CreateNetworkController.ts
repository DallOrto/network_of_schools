import { Request, Response } from "express";
import { CreateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { CreateNetworkService } from "../../services/network/CreateNetworkService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";

class CreateNetworkController {
  async handle(request: Request, response: Response) {
    const { name }: CreateNetworkRequest = request.body;

    const createNetworkService = new CreateNetworkService(
      new NetworkRepository()
    );

    const network = await createNetworkService.execute({ name });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "NETWORK",
      entityId: network.id,
      metadata: { name: network.name },
    });

    return response.status(201).json(network);
  }
}

export { CreateNetworkController };
