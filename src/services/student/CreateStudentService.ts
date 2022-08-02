import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../domain/dtos/student/StudentDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { AppError } from "../../error/AppError";

class CreateStudentService {
  private studentRepository: ICreateStudentRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    studentRepository: ICreateStudentRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    this.studentRepository = studentRepository;
    this.schoolRepository = schoolRepository;
  }

  async execute({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateStudentRequest): Promise<CreateStudentResponse> {
    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    return this.studentRepository.create({
      name,
      document,
      password,
      birthDate,
      schoolId
    });
  }
}

export { CreateStudentService };
