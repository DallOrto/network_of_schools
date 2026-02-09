import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { ICountStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICountStudentClassRepository";
import { IFindStudentClassesWithClassRepository, StudentClassWithClass } from "../../domain/interfaces/repositories/studentClass/IFindStudentClassesWithClassRepository";

class StudentClassRepository implements ICreateStudentClassRepository, ICountStudentClassRepository, IFindStudentClassesWithClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ studentId, classId }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {
        return this.prismaRepository.studentClass.create({
            data: {
                studentId,
                classId
            }
        });
    }

    async countByClassId(classId: string): Promise<number> {
        return this.prismaRepository.studentClass.count({
            where: {
                classId
            }
        });
    }

    async findByStudentIdWithClass(studentId: string): Promise<StudentClassWithClass[]> {
        return this.prismaRepository.studentClass.findMany({
            where: {
                studentId
            },
            include: {
                class: true
            }
        });
    }
}

export { StudentClassRepository };
