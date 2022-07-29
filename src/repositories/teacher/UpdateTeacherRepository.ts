import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { UpdateTeacherRequest, UpdateTeacherResponse } from "../../domain/dtos/teacher/UpdateTeacherDTO";
import { IUpdateTeacherRepository } from "../../domain/interfaces/repositories/teacher/IUpdateTeacherRepository";

class UpdateTeacherRepository implements IUpdateTeacherRepository {
    private updateTeacherRepository: PrismaClient;

    constructor() {
        this.updateTeacherRepository = prismaDB;
    }

    async updateTeacher(data: UpdateTeacherRequest): Promise<UpdateTeacherResponse>{
        return this.updateTeacherRepository.teacher.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                document: data.document,
                password: data.password,
                birthDate: data.birthDate,
                schoolId: data.schoolId
            }
        })
    }
}

export { UpdateTeacherRepository }