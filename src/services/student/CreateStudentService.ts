import bcrypt from "bcryptjs";
import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../domain/dtos/student/StudentDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { IComplianceService } from "../../domain/interfaces/services/IComplianceService";
import { AppError } from "../../error/AppError";

class CreateStudentService {
  private studentRepository: ICreateStudentRepository;
  private schoolRepository: ICreateSchoolRepository;
  private complianceService: IComplianceService;

  constructor(
    studentRepository: ICreateStudentRepository,
    schoolRepository: ICreateSchoolRepository,
    complianceService: IComplianceService
  ) {
    this.studentRepository = studentRepository;
    this.schoolRepository = schoolRepository;
    this.complianceService = complianceService;
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
      password,
      birthDate: String(birthDate),
      schoolId
    });

    if (!complianceResult.approved) {
      throw new AppError(
        complianceResult.reason || "Student not approved by compliance",
        422
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.studentRepository.create({
      name,
      document,
      password: hashedPassword,
      birthDate,
      schoolId
    });
  }
}

export { CreateStudentService };
