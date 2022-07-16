import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListSchoolFilter, ListSchoolResponse } from "../../domain/dtos/school/ListSchoolDTO";
import { IListSchoolRepository } from "../../domain/interfaces/repositories/school/IListSchoolRepository";

class ListSchoolRepository implements IListSchoolRepository{
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB
    }

    async listSchools(filter: ListSchoolFilter): Promise<ListSchoolResponse[]> {
        return this.prismaRepository.school.findMany({
            where:{
                networkId: filter.networkId
            }
        });
    }
}

export { ListSchoolRepository }