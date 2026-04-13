import bcrypt from "bcryptjs";
import {
  CreateStudentRequest,
} from "../../domain/dtos/student/StudentDTO";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { IComplianceService } from "../../domain/interfaces/services/IComplianceService";
import { ICreateEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { AppError } from "../../error/AppError";

export interface CreateStudentPendingResponse {
  enrollmentAttemptId: string;
  status: "PROCESSING";
}

class CreateStudentService {
  constructor(
    private studentRepository: ICreateStudentRepository,
    private schoolRepository: ICreateSchoolRepository,
    private complianceService: IComplianceService,
    private enrollmentAttemptRepository: ICreateEnrollmentAttemptRepository
  ) {}

  async execute({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateStudentRequest): Promise<CreateStudentPendingResponse> {
    const schoolExists = await this.schoolRepository.findOne(schoolId);

    if (!schoolExists) {
      throw new AppError("School does not exist!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o enrollment attempt como PROCESSING antes de chamar a compliance
    // Isso nos permite incluir o ID do attempt na callbackUrl
    const attempt = await this.enrollmentAttemptRepository.create({
      complianceStudentId: "pending", // será atualizado via callback
      studentName: name,
      studentDocument: document,
      studentBirthDate: new Date(birthDate),
      hashedPassword,
      schoolId,
      status: "PROCESSING",
    });

    // Chama a API de compliance de forma assíncrona
    // O resultado virá pelo webhook em POST /internal/compliance-result/:attemptId
    const callbackUrl = `${process.env.API_BASE_URL}/internal/compliance-result/${attempt.id}`;

    const complianceResult = await this.complianceService.check({
      name,
      document,
      birthDate: String(birthDate),
      schoolId,
      callbackUrl,
    });

    // Atualiza o attempt com o jobId retornado pela compliance
    await this.enrollmentAttemptRepository.updateJobId(attempt.id, complianceResult.jobId);

    return {
      enrollmentAttemptId: attempt.id,
      status: "PROCESSING",
    };
  }
}

export { CreateStudentService };
