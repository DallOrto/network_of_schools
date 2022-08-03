import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateNetworkResponse, UpdateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { IUpdateNetworkRepository } from "../../domain/interfaces/repositories/network/IUpdateNetworkRepository";

class UpdateNetworkRepository implements IUpdateNetworkRepository{
    private updateNetworkRepository: PrismaClient

    constructor(){
        this.updateNetworkRepository = prismaDB
    }

    async updateNetwork(data: UpdateNetworkRequest): Promise<CreateNetworkResponse> {
        return this.updateNetworkRepository.network.update({
            where: {
                id: data.id
            },
            data:{
                name: data.name
            }
        })
    }
}

export { UpdateNetworkRepository }