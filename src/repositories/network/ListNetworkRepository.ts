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
        const networks = await this.prismaRepository.network.findMany({
            where: filter.networkId ? { id: filter.networkId } : undefined,
            include: {
                School: {
                    include: {
                        Teacher: {
                            where: { user: { deletedAt: null } },
                            include: {
                                user: { select: { document: true } },
                            },
                        },
                        Student: {
                            where: { user: { deletedAt: null } },
                            include: {
                                user: { select: { document: true } },
                            },
                        },
                    },
                },
            },
        });

        return networks.map((network) => ({
            id: network.id,
            name: network.name,
            createdAt: network.createdAt,
            updatedAt: network.updatedAt,
            School: network.School.map((school) => ({
                id: school.id,
                name: school.name,
                address: school.address,
                networkId: school.networkId,
                createdAt: school.createdAt,
                updatedAt: school.updatedAt,
                Teacher: school.Teacher.map((t) => ({
                    id: t.id,
                    name: t.name,
                    document: t.user.document,
                    birthDate: t.birthDate,
                    schoolId: t.schoolId,
                    createdAt: t.createdAt,
                    updatedAt: t.updatedAt,
                })),
                Student: school.Student.map((s) => ({
                    id: s.id,
                    name: s.name,
                    document: s.user.document,
                    birthDate: s.birthDate,
                    schoolId: s.schoolId,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                })),
            })),
        }));
    }
}

export { ListNetworkRepository };
