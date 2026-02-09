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
    startTime,
    endTime,
    schoolId,
    maxStudents 
  }: CreateClassRequest): Promise<CreateClassResponse> {
    const classExist = await this.classRepository.findOneClass(
      name,
      classDay,
      startTime,
      endTime
    );

    if (classExist) {
      throw new AppError("Class already registered");
    }

    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    if (maxStudents <= 0) {
      throw new AppError("Maximum students must be greater than 0!");
    }

    return this.classRepository.create({
      name,
      classDay,
      startTime,
      endTime,
      schoolId,
      maxStudents
    });
  }
}

export { CreateClassService };
