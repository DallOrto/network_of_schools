import { Request, Response } from "express";
import { CreateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";
import { CreateNetworkService } from "../../services/network/CreateNetworkService";

class CreateNetworkController {
    async handle(request: Request, response: Response) {
        const { name }: CreateNetworkRequest = request.body;

        const createNetworkService = new CreateNetworkService(
            new NetworkRepository()
        );

        const network = await createNetworkService.execute({ name });

        return response.status(201).json(network);

    }
}

export { CreateNetworkController }