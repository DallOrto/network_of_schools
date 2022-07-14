import { Request, Response } from "express";
import { ICreateNetworkDTO } from "../../dtos/ICreateNetworkDTO";
import { CreateNetworkService } from "../../services/network/CreateNetworkService";

class CreateNetworkController {
    async handle(request: Request, response: Response) {
        const { name }: ICreateNetworkDTO = request.body;

        const createNetworkService = new CreateNetworkService();

        const network = await createNetworkService.execute({ name });

        return response.status(201).json(network);

        
    }
}

export { CreateNetworkController }