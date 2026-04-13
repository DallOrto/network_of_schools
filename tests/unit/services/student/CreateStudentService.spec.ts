import { CreateStudentService } from "../../../../src/services/student/CreateStudentService";
import { ICreateStudentRepository } from "../../../../src/domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateSchoolRepository } from "../../../../src/domain/interfaces/repositories/school/ICreateSchoolRepository";
import { IComplianceService } from "../../../../src/domain/interfaces/services/IComplianceService";
import { ICreateEnrollmentAttemptRepository } from "../../../../src/domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { AppError } from "../../../../src/error/AppError";

process.env.API_BASE_URL = "http://localhost:4003";

const mockSchool = {
  id: "school-id",
  name: "Escola Teste",
  address: "Rua A, 123",
  networkId: "network-id",
  createdAt: new Date(),
  updatedAt: new Date(),
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
  attemptedAt: new Date(),
};

const fakeStudentRequest = {
  name: "João Silva",
  document: "12345678900",
  password: "raw-password",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id",
};

const makeStudentRepository = (): jest.Mocked<ICreateStudentRepository> => ({
  create: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

const makeSchoolRepository = (): jest.Mocked<ICreateSchoolRepository> => ({
  create: jest.fn(),
  findOne: jest.fn().mockResolvedValue(mockSchool),
});

const makeComplianceService = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockResolvedValue({ jobId: "job-123", status: "PROCESSING" }),
});

const makeEnrollmentAttemptRepository = (): jest.Mocked<ICreateEnrollmentAttemptRepository> => ({
  create: jest.fn().mockResolvedValue(mockAttempt),
  updateJobId: jest.fn().mockResolvedValue(undefined),
  updateFromCallback: jest.fn().mockResolvedValue({}),
  findById: jest.fn().mockResolvedValue(mockAttempt),
});

beforeEach(() => jest.clearAllMocks());

describe("CreateStudentService", () => {
  it("deve retornar enrollmentAttemptId com status PROCESSING", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceService(),
      makeEnrollmentAttemptRepository()
    );

    const result = await service.execute(fakeStudentRequest);

    expect(result).toEqual({ enrollmentAttemptId: "attempt-id", status: "PROCESSING" });
  });

  it("não deve criar o aluno diretamente (criação ocorre no callback)", async () => {
    const studentRepo = makeStudentRepository();
    const service = new CreateStudentService(
      studentRepo,
      makeSchoolRepository(),
      makeComplianceService(),
      makeEnrollmentAttemptRepository()
    );

    await service.execute(fakeStudentRequest);

    expect(studentRepo.create).not.toHaveBeenCalled();
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

    await expect(service.execute(fakeStudentRequest)).rejects.toMatchObject({
      message: "School does not exist!",
    });
  });

  it("deve lançar AppError 503 quando o compliance está indisponível", async () => {
    const compliance = makeComplianceService();
    compliance.check.mockRejectedValue(new AppError("Compliance service unavailable", 503));

    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      compliance,
      makeEnrollmentAttemptRepository()
    );

    await expect(service.execute(fakeStudentRequest)).rejects.toMatchObject({
      statusCode: 503,
    });
  });
});
