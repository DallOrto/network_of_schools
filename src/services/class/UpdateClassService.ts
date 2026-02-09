import {
  UpdateClassRequest,
  UpdateClassResponse
} from "../../domain/dtos/class/UpdateClassDTO";
import { IUpdateClassRepository } from "../../domain/interfaces/repositories/class/IUpdateClassRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../error/AppError";

class UpdateClassService {
  private updateClassRepository: IUpdateClassRepository;
  private schoolRepository: ICreateSchoolRepository;

  constructor(
    updateClassRepository: IUpdateClassRepository,
    schoolRepository: ICreateSchoolRepository
  ) {
    this.updateClassRepository = updateClassRepository;
    this.schoolRepository = schoolRepository;
  }

  async execute(data: UpdateClassRequest): Promise<UpdateClassResponse> {
    if (!data.id) {
      throw new AppError("Class does not exists!");
    }

    const schoolExists = await this.schoolRepository.findOne(data.schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    if (data.maxStudents <= 0) {
      throw new AppError("Maximum students must be greater than 0!");
    }

    return this.updateClassRepository.updateClass(data);
  }
}

export { UpdateClassService };
