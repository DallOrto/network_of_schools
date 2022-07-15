import { School, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateSchoolRequest, CreateSchoolResponse } from "../../domain/dtos/school/SchoolDTO";
import { ISchoolRepository } from "../../domain/interfaces/repositories/school/ISchoolRepository";




class SchoolRepository implements ISchoolRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, address, networkId }:CreateSchoolRequest ): Promise<CreateSchoolResponse> {
        return this.prismaRepository.school.create({
            data: {
                name,
                address,
                networkId
            }
        });
    }
}

export { SchoolRepository };