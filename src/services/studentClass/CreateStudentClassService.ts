import {
  CreateStudentClassRequest,
  CreateStudentClassResponse
} from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { AppError } from "../../error/AppError";

class CreateStudentClassService {
  private studentClassRepository: ICreateStudentClassRepository;
  private studentRepository: ICreateStudentRepository;
  private classRepository: ICreateClassRepository;

  constructor(
    studentClassRepository: ICreateStudentClassRepository,
    studentRepository: ICreateStudentRepository,
    classRepository: ICreateClassRepository
  ) {
    this.studentClassRepository = studentClassRepository;
    this.studentRepository = studentRepository;
    this.classRepository = classRepository;
  }

  async execute({
    studentId,
    classId
  }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {
    const studentExists = await this.studentRepository.findOne(studentId);

    if (!studentExists) {
      throw new AppError("Student does not exist!");
    }

    const classExists = await this.classRepository.findOne(classId);

    if (!classExists) {
      throw new AppError("Class does not exist!");
    }

    return this.studentClassRepository.create({ studentId, classId });
  }
}

export { CreateStudentClassService };

function timeClassValidator(startTime: string, endTime: string) {
  startTime <= endTime || endTime >= startTime;
}
