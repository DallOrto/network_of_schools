import { Student, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateStudentRequest } from "../../domain/dtos/student/StudentDTO";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";



class StudentRepository implements ICreateStudentRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, document, password, birthDate, schoolId }: CreateStudentRequest ): Promise<Student> {
        const student = this.prismaRepository.student.create({
            data: {
                name,
                document,
                password,
                birthDate,
                schoolId
            }
        });

        return student;
    }
}

export { StudentRepository };