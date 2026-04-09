import {
  CreateTeacherClassRequest,
  CreateTeacherClassResponse
} from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { ICreateTeacherClassRepository } from "../../domain/interfaces/repositories/teacherClass/ICreateTeacherClassRepository";
import { AppError } from "../../error/AppError";

class CreateTeacherClassService {
  private teacherClassRepository: ICreateTeacherClassRepository;
  private teacherRepository: ICreateTeacherRepository;

  constructor(
    teacherClassRepository: ICreateTeacherClassRepository,
    teacherRepository: ICreateTeacherRepository,
  ) {
    this.teacherClassRepository = teacherClassRepository;
    this.teacherRepository = teacherRepository;
  }

  async execute({
    teacherId,
    classId
  }: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse> {
    const teacherExists = await this.teacherRepository.findOne(teacherId);

    if (!teacherExists) {
      throw new AppError("Teacher does not exist!");
    }

    return this.teacherClassRepository.createAtomic({ teacherId, classId });
  }
}

export { CreateTeacherClassService };
