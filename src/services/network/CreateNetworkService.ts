import { Network } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateNetworkDTO } from "../../dtos/ICreateNetworkDTO";

class CreateNetworkService {
    async execute({ name }: ICreateNetworkDTO): Promise<Network>{

        

        const network = await prismaDB.network.create({
            data: {
                name
            }
        });

        return network;
    }
}

export { CreateNetworkService}