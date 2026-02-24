import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { AppError } from "../../error/AppError";

class DeleteTeacherService {
  private teacherRepository: ICreateTeacherRepository;

  constructor(teacherRepository: ICreateTeacherRepository) {
    this.teacherRepository = teacherRepository;
  }

  async execute(id: string): Promise<void> {
    const teacherExists = await this.teacherRepository.findOne(id);

    if (!teacherExists) {
      throw new AppError("Teacher does not exist!", 404);
    }

    await this.teacherRepository.softDelete(id);
  }
}

export { DeleteTeacherService };
