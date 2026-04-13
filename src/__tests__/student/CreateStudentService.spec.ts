import { CreateStudentService } from "../../services/student/CreateStudentService";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { IComplianceService } from "../../domain/interfaces/services/IComplianceService";
import { ICreateEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { AppError } from "../../error/AppError";

const mockSchool = {
  id: "school-id",
  name: "Escola Teste",
  address: "Rua A, 123",
  networkId: "network-id",
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockAttempt = {
  id: "attempt-id",
  complianceStudentId: "pending",
  complianceJobId: null,
  studentId: null,
  studentName: "João Silva",
  studentDocument: "12345678900",
  studentBirthDate: new Date("2000-01-01"),
  hashedPassword: "hashed",
  schoolId: "school-id",
  status: "PROCESSING" as const,
  complianceId: null,
  rejectionReason: null,
  attemptedAt: new Date()
};

const studentInput = {
  name: "João Silva",
  document: "12345678900",
  password: "senha123",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id"
};

const makeStudentRepository = (): jest.Mocked<ICreateStudentRepository> => ({
  create: jest.fn(),
  findOne: jest.fn().mockResolvedValue(null),
  softDelete: jest.fn().mockResolvedValue(undefined)
});

const makeSchoolRepository = (): jest.Mocked<ICreateSchoolRepository> => ({
  create: jest.fn(),
  findOne: jest.fn().mockResolvedValue(mockSchool)
});

const makeComplianceService = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockResolvedValue({ jobId: "job-123", status: "PROCESSING" })
});

const makeComplianceUnavailable = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockRejectedValue(new AppError("Compliance service unavailable", 503))
});

const makeEnrollmentAttemptRepository = (): jest.Mocked<ICreateEnrollmentAttemptRepository> => ({
  create: jest.fn().mockResolvedValue(mockAttempt),
  updateJobId: jest.fn().mockResolvedValue(undefined),
  updateFromCallback: jest.fn().mockResolvedValue({}),
  findById: jest.fn().mockResolvedValue(mockAttempt)
});

// Seta API_BASE_URL para o callbackUrl ser construído
process.env.API_BASE_URL = "http://localhost:4003";

describe("CreateStudentService", () => {
  it("deve retornar enrollmentAttemptId com status PROCESSING", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceService(),
      makeEnrollmentAttemptRepository()
    );

    const result = await service.execute(studentInput);

    expect(result).toEqual({
      enrollmentAttemptId: "attempt-id",
      status: "PROCESSING"
    });
  });

  it("deve criar EnrollmentAttempt com status PROCESSING antes de chamar compliance", async () => {
    const enrollmentRepo = makeEnrollmentAttemptRepository();

    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceService(),
      enrollmentRepo
    );

    await service.execute(studentInput);

    expect(enrollmentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PROCESSING",
        studentName: "João Silva",
        studentDocument: "12345678900",
        schoolId: "school-id"
      })
    );
  });

  it("deve atualizar o jobId no attempt após receber resposta da compliance", async () => {
    const enrollmentRepo = makeEnrollmentAttemptRepository();

    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceService(),
      enrollmentRepo
    );

    await service.execute(studentInput);

    expect(enrollmentRepo.updateJobId).toHaveBeenCalledWith("attempt-id", "job-123");
  });

  it("deve enviar callbackUrl com o attemptId para a compliance", async () => {
    const complianceService = makeComplianceService();

    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      complianceService,
      makeEnrollmentAttemptRepository()
    );

    await service.execute(studentInput);

    expect(complianceService.check).toHaveBeenCalledWith(
      expect.objectContaining({
        callbackUrl: "http://localhost:4003/internal/compliance-result/attempt-id"
      })
    );
  });

  it("deve lançar AppError quando a escola não existe", async () => {
    const schoolRepo = makeSchoolRepository();
    schoolRepo.findOne.mockResolvedValue(null);

    const service = new CreateStudentService(
      makeStudentRepository(),
      schoolRepo,
      makeComplianceService(),
      makeEnrollmentAttemptRepository()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({
      message: "School does not exist!",
      statusCode: 400
    });
  });

  it("deve lançar AppError 503 quando o compliance está indisponível", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceUnavailable(),
      makeEnrollmentAttemptRepository()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({
      message: "Compliance service unavailable",
      statusCode: 503
    });
  });

  it("não deve chamar studentRepository.create (criação ocorre no callback)", async () => {
    const studentRepo = makeStudentRepository();

    const service = new CreateStudentService(
      studentRepo,
      makeSchoolRepository(),
      makeComplianceService(),
      makeEnrollmentAttemptRepository()
    );

    await service.execute(studentInput);

    expect(studentRepo.create).not.toHaveBeenCalled();
  });
});
