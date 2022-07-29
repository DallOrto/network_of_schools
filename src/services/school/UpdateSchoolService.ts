import { UpdateSchoolRequest, UpdateSchoolResponse } from "../../domain/dtos/school/UpdateSchoolDTO";
import { IUpdateSchoolRepository } from "../../domain/interfaces/repositories/school/IUpdateSchoolRepository";
import { AppError } from "../../error/AppError";

class UpdateSchoolService {
    private updateSchoolRepository: IUpdateSchoolRepository;

    constructor(
        updateSchoolRepository: IUpdateSchoolRepository
    ) {
        this.updateSchoolRepository = updateSchoolRepository
    }

    async execute(data:UpdateSchoolRequest): Promise<UpdateSchoolResponse> {
        if(!data.id) {
            throw new AppError("School does not exists!")
        }

        return this.updateSchoolRepository.updateSchool( data )
    }
}

export { UpdateSchoolService }