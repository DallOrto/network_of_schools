import {
  CreateTeacherRequest,
  CreateTeacherResponse
} from "../../domain/dtos/teacher/TeacherDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { AppError } from "../../error/AppError";

class CreateTeacherService {
  private teacherRepository: ICreateTeacherRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    teacherRepository: ICreateTeacherRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    this.teacherRepository = teacherRepository;
    this.schoolRepository = schoolRepository;
  }
  async execute({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateTeacherRequest): Promise<CreateTeacherResponse> {
    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    return this.teacherRepository.create({
      name,
      document,
      password,
      birthDate,
      schoolId
    });
  }
}

export { CreateTeacherService };
