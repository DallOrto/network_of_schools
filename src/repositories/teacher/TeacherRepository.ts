import { Teacher, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateTeacherDTO } from "../../dtos/ICreateTeacherDTO";
import { ITeacherRepository } from "../teacher/implementations/ITeacherRepository";


class TeacherRepository implements ITeacherRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, document, password, birthDate, schoolId }:ICreateTeacherDTO ): Promise<Teacher> {
        const teacher = this.prismaRepository.teacher.create({
            data: {
                name,
                document, 
                password, 
                birthDate, 
                schoolId
                
            }
        });

        return teacher;
    }
}

export { TeacherRepository };