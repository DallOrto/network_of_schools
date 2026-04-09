import bcrypt from "bcryptjs";
import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../domain/dtos/student/StudentDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { IComplianceService } from "../../domain/interfaces/services/IComplianceService";
import { ICreateEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { AppError } from "../../error/AppError";

class CreateStudentService {
  private studentRepository: ICreateStudentRepository;
  private schoolRepository: ICreateSchoolRepository;
  private complianceService: IComplianceService;
  private enrollmentAttemptRepository: ICreateEnrollmentAttemptRepository;

  constructor(
    studentRepository: ICreateStudentRepository,
    schoolRepository: ICreateSchoolRepository,
    complianceService: IComplianceService,
    enrollmentAttemptRepository: ICreateEnrollmentAttemptRepository
  ) {
    this.studentRepository = studentRepository;
    this.schoolRepository = schoolRepository;
    this.complianceService = complianceService;
    this.enrollmentAttemptRepository = enrollmentAttemptRepository;
  }

  async execute({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateStudentRequest): Promise<CreateStudentResponse> {
    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    const complianceResult = await this.complianceService.check({
      name,
      document,
      birthDate: String(birthDate),
      schoolId
    });

    if (!complianceResult.approved) {
      await this.enrollmentAttemptRepository.create({
        complianceStudentId: complianceResult.student.id,
        studentName: name,
        studentDocument: document,
        schoolId,
        status: "REJECTED",
        complianceId: complianceResult.complianceId,
        rejectionReason: complianceResult.reason ?? null
      });

      throw new AppError(
        complianceResult.reason || "Student not approved by compliance",
        422
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await this.studentRepository.create({
      name,
      document,
      password: hashedPassword,
      birthDate,
      schoolId
    });

    await this.enrollmentAttemptRepository.create({
      complianceStudentId: complianceResult.student.id,
      studentId: student.id,
      studentName: name,
      studentDocument: document,
      schoolId,
      status: "APPROVED",
      complianceId: complianceResult.complianceId
    });

    return student;
  }
}

export { CreateStudentService };
