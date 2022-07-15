import { School } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateSchoolRequest, CreateSchoolResponse } from "../../domain/dtos/school/SchoolDTO";
import { ISchoolRepository } from "../../domain/interfaces/repositories/school/ISchoolRepository";

class CreateSchoolService {
    private schoolRepository: ISchoolRepository;

    constructor(
        schoolRepository: ISchoolRepository
    ) {
        this.schoolRepository = schoolRepository;
    }

    async execute({ name, address, networkId}: CreateSchoolRequest ): Promise<CreateSchoolResponse> {
        return this.schoolRepository.create({name, address, networkId});
    }
}

export { CreateSchoolService }