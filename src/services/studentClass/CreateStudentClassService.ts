import {
  CreateStudentClassRequest,
  CreateStudentClassResponse
} from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { AppError } from "../../error/AppError";

class CreateStudentClassService {
  private studentClassRepository: ICreateStudentClassRepository;
  private studentRepository: ICreateStudentRepository;

  constructor(
    studentClassRepository: ICreateStudentClassRepository,
    studentRepository: ICreateStudentRepository,
  ) {
    this.studentClassRepository = studentClassRepository;
    this.studentRepository = studentRepository;
  }

  async execute({
    studentId,
    classId
  }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {
    const studentExists = await this.studentRepository.findOne(studentId);

    if (!studentExists) {
      throw new AppError("Student does not exist!");
    }

    return this.studentClassRepository.createAtomic({ studentId, classId });
  }
}

export { CreateStudentClassService };

function timeClassValidator(startTime: string, endTime: string) {
  startTime <= endTime || endTime >= startTime;
}
