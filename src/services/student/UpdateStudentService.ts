
import { UpdateStudentRequest, UpdateStudentResponse } from "../../domain/dtos/student/updateStudentDTO";
import { IUpdateStudentRepository } from "../../domain/interfaces/repositories/student/IUpdateStudentRepository";
import { AppError } from "../../error/AppError";

class UpdateStudentService {
    private updateStudentRepository: IUpdateStudentRepository;

    constructor(
        updateStudentRepository: IUpdateStudentRepository
    ) {
        this.updateStudentRepository = updateStudentRepository
    }

    async execute(data:UpdateStudentRequest): Promise<UpdateStudentResponse>{
        if(!data.id) {
            throw new AppError("Student does not exists!")
        }

        return this.updateStudentRepository.updateStudent( data );
    }
}

export { UpdateStudentService }