import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListStudentInNetworkFilter, ListStudentInNetworkResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentInNetworkRepository } from "../../domain/interfaces/repositories/student/IListStudentInNetworkRepository";


class ListStudentInNetworkRepository implements IListStudentInNetworkRepository {
    private prismaRepository: PrismaClient;

    constructor(){
        this.prismaRepository = prismaDB
    }

    async listStudentInNetwork(filter: ListStudentInNetworkFilter): Promise<ListStudentInNetworkResponse[]>{
        return this.prismaRepository.student.findMany({
            where: {
                school: {
                    networkId: filter.networkId
                }
            }

        });
    }
}

export { ListStudentInNetworkRepository }