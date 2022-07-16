import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListTeacherFilter, ListTeacherResponse } from "../../domain/dtos/teacher/ListTeacherDTO";
import { IListTeacherRepository } from "../../domain/interfaces/repositories/teacher/IListTeacherRepository";

class ListTeacherRepository implements IListTeacherRepository{
    private primaRepository: PrismaClient;

    constructor(){
        this.primaRepository = prismaDB
    }

    async listTeacher(filter: ListTeacherFilter): Promise<ListTeacherResponse[]>{
        return this.primaRepository.teacher.findMany({
            where: {
                schoolId: filter.schoolId
            }
        });
    }
}

export { ListTeacherRepository }