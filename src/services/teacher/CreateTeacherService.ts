import { CreateTeacherRequest, CreateTeacherResponse } from "../../domain/dtos/teacher/TeacherDTO";
import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";

class CreateTeacherService {
    private teacherRepository: ICreateTeacherRepository;

    constructor(
        teacherRepository: ICreateTeacherRepository
    ) {
        this.teacherRepository = teacherRepository
    }
    async execute({name, document, password, birthDate, schoolId}: CreateTeacherRequest): Promise<CreateTeacherResponse>{
        return this.teacherRepository.create({ name, document, password, birthDate, schoolId });
    }
}

export { CreateTeacherService }