import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { UpdateSchoolRequest, UpdateSchoolResponse } from "../../domain/dtos/school/UpdateSchoolDTO";
import { IUpdateSchoolRepository } from "../../domain/interfaces/repositories/school/IUpdateSchoolRepository";

class UpdateSchoolRepository implements IUpdateSchoolRepository{
    private updateSchoolRepository: PrismaClient;

    constructor(){
        this.updateSchoolRepository = prismaDB
    }

    async updateSchool(data: UpdateSchoolRequest): Promise<UpdateSchoolResponse> {
        return this.updateSchoolRepository.school.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                address: data.address,
                networkId: data.networkId
            }
        })
    }
}

export { UpdateSchoolRepository }