import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateClassRequest, CreateClassResponse } from "../../domain/dtos/class/ClassDTO";
import { IClassRepository } from "../../domain/interfaces/repositories/class/IClassRepository";

class ClassRepository implements IClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, classDay, time, schoolId }: CreateClassRequest ): Promise<CreateClassResponse> {
        return this.prismaRepository.class.create({
            data: {
                name,
                classDay,
                time,
                schoolId
            }
        });
    }
}

export { ClassRepository };