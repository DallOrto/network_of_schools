import { Network } from ".prisma/client";
import { prismaClient } from "../database/prismaClient";
import { ICreateNetworkDTO } from "../dtos/ICreateNetworkDTO";

class CreateNetworkService {
    async execute({ name }: ICreateNetworkDTO): Promise<Network>{

        

        const network = await prismaClient.network.create({
            data: {
                name
            }
        });

        return network;
    }
}

export { CreateNetworkService}