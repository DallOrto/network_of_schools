import { School, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateSchoolDTO } from "../../dtos/ICreateSchoolDTO";
import { ISchoolRepository } from "../school/implementations/ISchoolRepository";


class NetworkRepository implements ISchoolRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, address, networkId }:ICreateSchoolDTO ): Promise<School> {
        const school = this.prismaRepository.school.create({
            data: {
                name,
                address,
                networkId
            }
        });

        return school;
    }
}

export { NetworkRepository };