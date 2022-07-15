import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateTeacherClassRequest, CreateTeacherClassResponse } from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ITeacherClassRepository } from "../../domain/interfaces/repositories/teacherClass/ITeacherClassRepository";

class TeacherClassRepository implements ITeacherClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ teacherId, classId }: CreateTeacherClassRequest ): Promise<CreateTeacherClassResponse> {
        return this.prismaRepository.teacherClass.create({
            data: {
                teacherId,
                classId
            }
        });
    }
}

export { TeacherClassRepository };