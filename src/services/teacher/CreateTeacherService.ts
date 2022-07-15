import { CreateTeacherRequest, CreateTeacherResponse } from "../../domain/dtos/teacher/TeacherDTO";
import { ITeacherRepository } from "../../domain/interfaces/repositories/teacher/ITeacherRepository";

class CreateTeacherService {
    private teacherRepository: ITeacherRepository;

    constructor(
        teacherRepository: ITeacherRepository
    ) {
        this.teacherRepository = teacherRepository
    }
    async execute({name, document, password, birthDate, schoolId}: CreateTeacherRequest): Promise<CreateTeacherResponse>{
        return this.teacherRepository.create({ name, document, password, birthDate, schoolId });
    }
}

export { CreateTeacherService }