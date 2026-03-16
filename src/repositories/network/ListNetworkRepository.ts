import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListNetworkFilter, ListNetworkResponse } from "../../domain/dtos/network/ListNetworkDTO";
import { IListNetworkRepository } from "../../domain/interfaces/repositories/network/IListNetworkRepository";

class ListNetworkRepository implements IListNetworkRepository {
    private prismaRepository: PrismaClient;

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async listNetwork(filter: ListNetworkFilter): Promise<ListNetworkResponse[]> {
        return this.prismaRepository.network.findMany({
            where: filter.networkId ? { id: filter.networkId } : undefined,
            include: {
                School: {
                    include: {
                        Teacher: {
                            where: { deletedAt: null },
                            select: {
                                id: true,
                                name: true,
                                document: true,
                                birthDate: true,
                                schoolId: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        },
                        Student: {
                            where: { deletedAt: null },
                            select: {
                                id: true,
                                name: true,
                                document: true,
                                birthDate: true,
                                schoolId: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        },
                    },
                },
            },
        }) as unknown as ListNetworkResponse[];
    }
}

export { ListNetworkRepository };
