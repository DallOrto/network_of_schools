import {
  CreateTeacherClassRequest,
  CreateTeacherClassResponse
} from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";
import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { ICreateTeacherClassRepository } from "../../domain/interfaces/repositories/teacherClass/ICreateTeacherClassRepository";
import { AppError } from "../../error/AppError";

class CreateTeacherClassService {
  private teacherClassRepository: ICreateTeacherClassRepository;
  private classRepository: ICreateClassRepository;
  private teacherRepository: ICreateTeacherRepository;

  constructor(
    teacherClassRepository: ICreateTeacherClassRepository,
    teacherRepository: ICreateTeacherRepository,
    classRepository: ICreateClassRepository
  ) {
    this.teacherClassRepository = teacherClassRepository;
    this.teacherRepository = teacherRepository;
    this.classRepository = classRepository;
  }

  async execute({
    teacherId,
    classId
  }: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse> {
    const teacherExists = await this.teacherRepository.findOne(teacherId);

    if (!teacherExists) {
      throw new AppError("Teacher does not exist!");
    }

    const classExists = await this.classRepository.findOne(classId);

    if (!classExists) {
      throw new AppError("Class does not exist!");
    }

    return this.teacherClassRepository.create({ teacherId, classId });
  }
}

export { CreateTeacherClassService };
