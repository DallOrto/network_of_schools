import { CreateStudentRequest, CreateStudentResponse } from "../../domain/dtos/student/StudentDTO";
import { IStudentRepository } from "../../domain/interfaces/repositories/student/IStudentRepository";


class CreateStudentService {
    private studentRepository: IStudentRepository;

    constructor(
        studentRepository: IStudentRepository
    ) {
        this.studentRepository = studentRepository
    }

    async execute({ name, document, password, birthDate, schoolId }: CreateStudentRequest): Promise<CreateStudentResponse> {
        return this.studentRepository.create({ name, document, password, birthDate, schoolId });
    }
}

export { CreateStudentService }