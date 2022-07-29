import { UpdateClassRequest, UpdateClassResponse } from "../../domain/dtos/class/UpdateClassDTO";
import { IUpdateClassRepository } from "../../domain/interfaces/repositories/class/IUpdateClassRepository";
import { AppError } from "../../error/AppError";

class UpdateClassService {
    private updateClassRepository: IUpdateClassRepository;

    constructor(
        updateClassRepository: IUpdateClassRepository
    ) {
        this.updateClassRepository = updateClassRepository
    }

    async execute(data: UpdateClassRequest): Promise<UpdateClassResponse> {
        if(!data.id) {
            throw new AppError("Class does not exists!")
        }

        return this.updateClassRepository.updateClass( data )
    }
}

export { UpdateClassService }