import { ProcessComplianceCallbackService } from "../../../../src/services/compliance/ProcessComplianceCallbackService";
import { ICreateEnrollmentAttemptRepository } from "../../../../src/domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { ICreateStudentRepository } from "../../../../src/domain/interfaces/repositories/student/ICreateStudentRepository";
import { AppError } from "../../../../src/error/AppError";
import { CreateEnrollmentAttemptResponse } from "../../../../src/domain/dtos/enrollmentAttempt/EnrollmentAttemptDTO";

const makePendingAttempt = (overrides = {}): CreateEnrollmentAttemptResponse => ({
  id: "attempt-id",
  complianceStudentId: "pending",
  complianceJobId: "job-id",
  studentId: null,
  studentName: "João Silva",
  studentDocument: "12345678900",
  studentBirthDate: new Date("2000-01-01"),
  hashedPassword: "hashed-pw",
  schoolId: "school-id",
  status: "PROCESSING",
  complianceId: null,
  rejectionReason: null,
  attemptedAt: new Date(),
  ...overrides,
});

const fakeStudent = {
  id: "student-id",
  name: "João Silva",
  document: "12345678900",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const makeEnrollmentRepo = (attempt: CreateEnrollmentAttemptResponse | null = makePendingAttempt()): jest.Mocked<ICreateEnrollmentAttemptRepository> => ({
  create: jest.fn(),
  updateJobId: jest.fn().mockResolvedValue(undefined),
  updateFromCallback: jest.fn().mockResolvedValue({}),
  findById: jest.fn().mockResolvedValue(attempt),
});

const makeStudentRepo = (): jest.Mocked<ICreateStudentRepository> => ({
  create: jest.fn().mockResolvedValue(fakeStudent),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

const approvedPayload = {
  jobId: "job-id",
  complianceId: "compliance-id",
  approved: true,
  reason: null,
  complianceStudentId: "cs-id",
};

const rejectedPayload = {
  jobId: "job-id",
  complianceId: "compliance-id",
  approved: false,
  reason: "Documentação inválida",
  complianceStudentId: "cs-id",
};

describe("ProcessComplianceCallbackService", () => {
  it("deve criar o aluno quando o callback indica aprovação", async () => {
    const studentRepo = makeStudentRepo();
    const enrollmentRepo = makeEnrollmentRepo();
    const service = new ProcessComplianceCallbackService(enrollmentRepo, studentRepo);

    await service.execute("attempt-id", approvedPayload);

    expect(studentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "João Silva",
        document: "12345678900",
        password: "hashed-pw",
        schoolId: "school-id",
      })
    );
  });

  it("deve atualizar o attempt para APPROVED com studentId após aprovação", async () => {
    const enrollmentRepo = makeEnrollmentRepo();
    const service = new ProcessComplianceCallbackService(enrollmentRepo, makeStudentRepo());

    await service.execute("attempt-id", approvedPayload);

    expect(enrollmentRepo.updateFromCallback).toHaveBeenCalledWith(
      "attempt-id",
      expect.objectContaining({
        status: "APPROVED",
        complianceId: "compliance-id",
        complianceStudentId: "cs-id",
        studentId: "student-id",
      })
    );
  });

  it("deve atualizar o attempt para REJECTED sem criar aluno quando callback rejeita", async () => {
    const studentRepo = makeStudentRepo();
    const enrollmentRepo = makeEnrollmentRepo();
    const service = new ProcessComplianceCallbackService(enrollmentRepo, studentRepo);

    await service.execute("attempt-id", rejectedPayload);

    expect(studentRepo.create).not.toHaveBeenCalled();
    expect(enrollmentRepo.updateFromCallback).toHaveBeenCalledWith(
      "attempt-id",
      expect.objectContaining({
        status: "REJECTED",
        complianceId: "compliance-id",
        rejectionReason: "Documentação inválida",
      })
    );
  });

  it("deve lançar AppError 404 quando o attempt não é encontrado", async () => {
    const enrollmentRepo = makeEnrollmentRepo(null);
    const service = new ProcessComplianceCallbackService(enrollmentRepo, makeStudentRepo());

    await expect(service.execute("attempt-inexistente", approvedPayload)).rejects.toMatchObject({
      message: "Enrollment attempt not found",
      statusCode: 404,
    });
  });

  it("deve ignorar callback duplicado (attempt já processado)", async () => {
    const approvedAttempt = makePendingAttempt({ status: "APPROVED" });
    const enrollmentRepo = makeEnrollmentRepo(approvedAttempt);
    const studentRepo = makeStudentRepo();
    const service = new ProcessComplianceCallbackService(enrollmentRepo, studentRepo);

    // Não deve lançar e não deve chamar update nem create
    await expect(service.execute("attempt-id", approvedPayload)).resolves.toBeUndefined();
    expect(enrollmentRepo.updateFromCallback).not.toHaveBeenCalled();
    expect(studentRepo.create).not.toHaveBeenCalled();
  });
});
