import { TeacherClass, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateTeacherClassDTO } from "../../dtos/ICreateTeacherClassDTO";
import { ITeacherClassRepository } from "../teacherClass/implementations/ITeacherClassRepository";


class TeacherClassRepository implements ITeacherClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ teacherId, classId }:ICreateTeacherClassDTO ): Promise<TeacherClass> {
        const teacherClass = this.prismaRepository.teacherClass.create({
            data: {
                teacherId,
                classId
            }
        });

        return teacherClass;
    }
}

export { TeacherClassRepository };