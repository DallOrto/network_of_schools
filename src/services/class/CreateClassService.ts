import {
  CreateClassRequest,
  CreateClassResponse
} from "../../domain/dtos/class/ClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../error/AppError";

class CreateClassService {
  private classRepository: ICreateClassRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    classRepository: ICreateClassRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    (this.classRepository = classRepository),
      (this.schoolRepository = schoolRepository);
  }

  async execute({
    name,
    classDay,
    time,
    schoolId
  }: CreateClassRequest): Promise<CreateClassResponse> {
    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    return this.classRepository.create({ name, classDay, time, schoolId });
  }
}

export { CreateClassService };
