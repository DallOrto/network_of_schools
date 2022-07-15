import { Student, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateStudentDTO } from "../../dtos/ICreateStudentDTO";
import { IStudentRepository } from "../student/implementations/IStudentRepository";


class StudentRepository implements IStudentRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, document, password, birthDate, schoolId }:ICreateStudentDTO ): Promise<Student> {
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