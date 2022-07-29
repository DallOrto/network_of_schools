import { UpdateTeacherRequest, UpdateTeacherResponse } from "../../domain/dtos/teacher/UpdateTeacherDTO";
import { IUpdateTeacherRepository } from "../../domain/interfaces/repositories/teacher/IUpdateTeacherRepository";
import { AppError } from "../../error/AppError";

class UpdateTeacherService{
    private updateTeacherRepository: IUpdateTeacherRepository;

    constructor(
        updateTeacherRepository: IUpdateTeacherRepository
    ) {
        this.updateTeacherRepository = updateTeacherRepository
    }

    async execute(data: UpdateTeacherRequest): Promise<UpdateTeacherResponse>{
        if(!data.id) {
            throw new AppError("Teacher does not exists!")
        }

        return this.updateTeacherRepository.updateTeacher( data );
    }
}

export { UpdateTeacherService }