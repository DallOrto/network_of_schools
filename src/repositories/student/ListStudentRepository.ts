import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListStudentFilter, ListStudentResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentRepository } from "../../domain/interfaces/repositories/student/IListStudentRepository";

class ListStudentRepository implements IListStudentRepository{
    private prismaRepository: PrismaClient;

    constructor(){
        this.prismaRepository = prismaDB
    }

    async listStudent(filter: ListStudentFilter):Promise<ListStudentResponse[]>{
        return this.prismaRepository.student.findMany({
            where: {
                schoolId: filter.schoolId
            }
        });
    }
}

export { ListStudentRepository }