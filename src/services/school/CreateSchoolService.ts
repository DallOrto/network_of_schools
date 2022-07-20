import { CreateSchoolRequest, CreateSchoolResponse } from "../../domain/dtos/school/SchoolDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";

class CreateSchoolService {
    private schoolRepository: ICreateSchoolRepository;

    constructor(
        schoolRepository: ICreateSchoolRepository
    ) {
        this.schoolRepository = schoolRepository;
    }

    async execute({ name, address, networkId}: CreateSchoolRequest ): Promise<CreateSchoolResponse> {
        return this.schoolRepository.create({name, address, networkId});
    }
}

export { CreateSchoolService }