import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";

class StudentClassRepository implements ICreateStudentClassRepository {
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