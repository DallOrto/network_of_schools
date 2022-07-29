import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateSchoolRequest, CreateSchoolResponse } from "../../domain/dtos/school/SchoolDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";

class CreateSchoolRepository implements ICreateSchoolRepository {
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

export { CreateSchoolRepository };