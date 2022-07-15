import { StudentClass, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateStudentClassDTO } from "../../dtos/ICreateStudentClassDTO";
import { IStudentClassRepository } from "../studentClass/implementations/IStudentClassRepository";


class StudentClassRepository implements IStudentClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ studentId, classId }:ICreateStudentClassDTO ): Promise<StudentClass> {
        const studentClass = this.prismaRepository.studentClass.create({
            data: {
                studentId,
                classId
            }
        });

        return studentClass;
    }
}

export { StudentClassRepository };