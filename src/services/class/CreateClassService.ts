import { CreateClassRequest, CreateClassResponse } from "../../domain/dtos/class/ClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";

class CreateClassService {
    private classRepository: ICreateClassRepository;

    constructor(
        classRepository: ICreateClassRepository
    ) {
        this.classRepository = classRepository
    }

    async execute({name, classDay, time, schoolId}: CreateClassRequest): Promise<CreateClassResponse> {
        return this.classRepository.create({ name, classDay, time, schoolId });
    }
}

export { CreateClassService }