import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { AppError } from "../../error/AppError";

class DeleteStudentService {
  private studentRepository: ICreateStudentRepository;

  constructor(studentRepository: ICreateStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(id: string): Promise<void> {
    const studentExists = await this.studentRepository.findOne(id);

    if (!studentExists) {
      throw new AppError("Student does not exist!", 404);
    }

    await this.studentRepository.softDelete(id);
  }
}

export { DeleteStudentService };
