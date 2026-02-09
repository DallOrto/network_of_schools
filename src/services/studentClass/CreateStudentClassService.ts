import {
  CreateStudentClassRequest,
  CreateStudentClassResponse
} from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { ICountStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICountStudentClassRepository";
import { AppError } from "../../error/AppError";
import { IFindStudentClassesWithClassRepository } from "../../domain/interfaces/repositories/studentClass/IFindStudentClassesWithClassRepository";
import { hasScheduleConflict } from "../../utils/scheduleConflict";

class CreateStudentClassService {
  private studentClassRepository: ICreateStudentClassRepository &
    ICountStudentClassRepository & IFindStudentClassesWithClassRepository;
  private studentRepository: ICreateStudentRepository;
  private classRepository: ICreateClassRepository;

  constructor(
    studentClassRepository: ICreateStudentClassRepository &
      ICountStudentClassRepository &
      IFindStudentClassesWithClassRepository,
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

    const studentClasses =
      await this.studentClassRepository.findByStudentIdWithClass(studentId);

    for (const studentClass of studentClasses) {
      if (hasScheduleConflict(studentClass.class, classExists)) {
        throw new AppError(
          `Schedule conflict! Student is already enrolled in "${studentClass.class.name}" ` +
          `on ${studentClass.class.classDay} from ${studentClass.class.startTime} to ${studentClass.class.endTime}.`
        );
      }
    }

    const currentStudentCount =
      await this.studentClassRepository.countByClassId(classId);

    if (currentStudentCount >= classExists.maxStudents) {
      throw new AppError(
        `Class has reached maximum capacity of ${classExists.maxStudents} students!`
      );
    }

    return this.studentClassRepository.create({ studentId, classId });
  }
}

export { CreateStudentClassService };

function timeClassValidator(startTime: string, endTime: string) {
  startTime <= endTime || endTime >= startTime;
}
