import { Request, Response } from "express";
import { ListNetworkFilter } from "../../domain/dtos/network/ListNetworkDTO";
import { ListNetworkRepository } from "../../repositories/network/ListNetworkRepository";
import { ListNetworkService } from "../../services/network/ListNetworkService";

class ListNetworkController {
    async handle(request: Request, response: Response) {
        const { networkId }: ListNetworkFilter = request.query;

        const listNetworkService = new ListNetworkService(
            new ListNetworkRepository()
        );

        const networks = await listNetworkService.execute({ networkId });

        return response.status(200).json(networks);
    }
}

export { ListNetworkController };
