import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../domain/dtos/studentClass/StudentClassDTO";
import { IStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/IStudentClassRepository";

class StudentClassRepository implements IStudentClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ studentId, classId }: CreateStudentClassRequest ): Promise<CreateStudentClassResponse> {
        return this.prismaRepository.studentClass.create({
            data: {
                studentId,
                classId
            }
        });
    }
}

export { StudentClassRepository };