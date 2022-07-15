import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateTeacherRequest, CreateTeacherResponse } from "../../domain/dtos/teacher/TeacherDTO";
import { ITeacherRepository } from "../../domain/interfaces/repositories/teacher/ITeacherRepository";

class TeacherRepository implements ITeacherRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, document, password, birthDate, schoolId }: CreateTeacherRequest ): Promise<CreateTeacherResponse> {
        return this.prismaRepository.teacher.create({
            data: {
                name, document, password, birthDate, schoolId
            }
        });
    }
}

export { TeacherRepository };