import { Network, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateNetworkDTO } from "../../dtos/ICreateNetworkDTO";
import { INetworkRepository } from "../network/implementations/INetworkRepository";


class NetworkRepository implements INetworkRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name }:ICreateNetworkDTO ): Promise<Network> {
        const network = this.prismaRepository.network.create({
            data: {
                name
            }
        });

        return network;
    }
}

export { NetworkRepository };