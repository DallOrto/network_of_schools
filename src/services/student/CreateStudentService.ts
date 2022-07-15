import { CreateStudentRequest, CreateStudentResponse } from "../../domain/dtos/student/StudentDTO";
import { ITeacherRepository } from "../../domain/interfaces/repositories/teacher/ITeacherRepository";

class CreateStudentService {
    private teacherRepository: ITeacherRepository;

    constructor(
        teacherRepository: ITeacherRepository
    ) {
        this.teacherRepository = teacherRepository
    }

    async execute({ name, document, password, birthDate, schoolId }: CreateStudentRequest): Promise<CreateStudentResponse> {
        return this.teacherRepository.create({ name, document, password, birthDate, schoolId });
    }
}

export { CreateStudentService }