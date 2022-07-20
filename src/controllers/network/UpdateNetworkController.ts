import { Request, Response } from "express";
import { UpdateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { UpdateNetworkRepository } from "../../repositories/network/UpdateNetworkRepository";
import { UpdateNetworkService } from "../../services/network/UpdateNetworkService";

class UpdateNetworkController {
    async handle(request: Request, response: Response){
        const { id } = request.params;
        const { name } = request.body

        const updateNetworkService = new UpdateNetworkService(
            new UpdateNetworkRepository()
        )

        const networkUpdate = await updateNetworkService.execute({id, name})

        return response.status(201).json(networkUpdate);
    }
}

export { UpdateNetworkController }