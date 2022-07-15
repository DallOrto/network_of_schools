import { CreateClassRequest, CreateClassResponse } from "../../domain/dtos/class/ClassDTO";
import { IClassRepository } from "../../domain/interfaces/repositories/class/IClassRepository";

class CreateClassService {
    private classRepository: IClassRepository;

    constructor(
        classRepository: IClassRepository
    ) {
        this.classRepository = classRepository
    }

    async execute({name, classDay, time, schoolId}: CreateClassRequest): Promise<CreateClassResponse> {
        return this.classRepository.create({ name, classDay, time, schoolId });
    }
}

export { CreateClassService }