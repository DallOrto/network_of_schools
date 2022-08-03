import { CreateStudentRequest, CreateStudentResponse } from "../../domain/dtos/student/StudentDTO";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";


class CreateStudentService {
    private studentRepository: ICreateStudentRepository;

    constructor(
        studentRepository: ICreateStudentRepository
    ) {
        this.studentRepository = studentRepository
    }

    async execute({ name, document, password, birthDate, schoolId }: CreateStudentRequest): Promise<CreateStudentResponse> {
        return this.studentRepository.create({ name, document, password, birthDate, schoolId });
    }
}

export { CreateStudentService }