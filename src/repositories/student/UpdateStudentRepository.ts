import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { UpdateStudentRequest, UpdateStudentResponse } from "../../domain/dtos/student/UpdateStudentDTO";


import { IUpdateStudentRepository } from "../../domain/interfaces/repositories/student/IUpdateStudentRepository";

class UpdateStudentRepository implements IUpdateStudentRepository{
    private updateStudentRepository: PrismaClient;

    constructor(){
        this.updateStudentRepository = prismaDB
    }

    async updateStudent(data: UpdateStudentRequest): Promise<UpdateStudentResponse> {
        return this.updateStudentRepository.student.update({
            where: {
                id: data.id
            },
            data:{
                name: data.name,
                document: data.document,
                password: data.password,
                birthDate: data.birthDate,
                schoolId: data.schoolId
            }
        })
    }


}

export { UpdateStudentRepository }