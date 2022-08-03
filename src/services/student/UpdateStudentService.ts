import {
  UpdateStudentRequest,
  UpdateStudentResponse
} from "../../domain/dtos/student/UpdateStudentDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { IUpdateStudentRepository } from "../../domain/interfaces/repositories/student/IUpdateStudentRepository";
import { AppError } from "../../error/AppError";

class UpdateStudentService {
  private updateStudentRepository: IUpdateStudentRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    updateStudentRepository: IUpdateStudentRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    this.updateStudentRepository = updateStudentRepository;
    this.schoolRepository = schoolRepository;
  }

  async execute(data: UpdateStudentRequest): Promise<UpdateStudentResponse> {
    if (!data.id) {
      throw new AppError("Student does not exists!");
    }

    const schoolExists = await this.schoolRepository.findOne(data.schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    return this.updateStudentRepository.updateStudent(data);
  }
}

export { UpdateStudentService };
