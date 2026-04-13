import { ICreateEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { AppError } from "../../error/AppError";

export interface ComplianceCallbackPayload {
  jobId: string;
  complianceId: string;
  approved: boolean;
  reason: string | null;
  complianceStudentId: string;
}

class ProcessComplianceCallbackService {
  constructor(
    private enrollmentAttemptRepository: ICreateEnrollmentAttemptRepository,
    private studentRepository: ICreateStudentRepository,
  ) {}

  async execute(attemptId: string, payload: ComplianceCallbackPayload): Promise<void> {
    const attempt = await this.enrollmentAttemptRepository.findById(attemptId);

    if (!attempt) {
      throw new AppError("Enrollment attempt not found", 404);
    }

    if (attempt.status !== "PROCESSING") {
      // Callback duplicado — ignora silenciosamente
      return;
    }

    if (!payload.approved) {
      await this.enrollmentAttemptRepository.updateFromCallback(attemptId, {
        status: "REJECTED",
        complianceStudentId: payload.complianceStudentId,
        complianceId: payload.complianceId,
        rejectionReason: payload.reason,
      });
      return;
    }

    // Aprovado — cria o aluno usando os dados salvos no attempt
    const student = await this.studentRepository.create({
      name: attempt.studentName,
      document: attempt.studentDocument,
      password: attempt.hashedPassword,
      birthDate: attempt.studentBirthDate,
      schoolId: attempt.schoolId,
    });

    await this.enrollmentAttemptRepository.updateFromCallback(attemptId, {
      status: "APPROVED",
      complianceStudentId: payload.complianceStudentId,
      complianceId: payload.complianceId,
      studentId: student.id,
    });
  }
}

export { ProcessComplianceCallbackService };
