import {
  UpdateTeacherRequest,
  UpdateTeacherResponse
} from "../../domain/dtos/teacher/UpdateTeacherDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { IUpdateTeacherRepository } from "../../domain/interfaces/repositories/teacher/IUpdateTeacherRepository";
import { AppError } from "../../error/AppError";

class UpdateTeacherService {
  private updateTeacherRepository: IUpdateTeacherRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    updateTeacherRepository: IUpdateTeacherRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    this.updateTeacherRepository = updateTeacherRepository;
    this.schoolRepository = schoolRepository;
  }

  async execute(data: UpdateTeacherRequest): Promise<UpdateTeacherResponse> {
    if (!data.id) {
      throw new AppError("Teacher does not exists!");
    }

    const schoolExists = await this.schoolRepository.findOne(data.schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    return this.updateTeacherRepository.updateTeacher(data);
  }
}

export { UpdateTeacherService };
