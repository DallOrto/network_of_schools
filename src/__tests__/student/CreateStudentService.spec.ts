import { CreateStudentService } from "../../services/student/CreateStudentService";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { IComplianceService } from "../../domain/interfaces/services/IComplianceService";
import { AppError } from "../../error/AppError";

const mockSchool = {
  id: "school-id",
  name: "Escola Teste",
  address: "Rua A, 123",
  networkId: "network-id",
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockStudent = {
  id: "student-id",
  name: "João Silva",
  document: "12345678900",
  password: "hashed",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id",
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

const studentInput = {
  name: "João Silva",
  document: "12345678900",
  password: "senha123",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id"
};

const makeStudentRepository = (): jest.Mocked<ICreateStudentRepository> => ({
  create: jest.fn().mockResolvedValue(mockStudent),
  findOne: jest.fn().mockResolvedValue(null),
  softDelete: jest.fn().mockResolvedValue(undefined)
});

const makeSchoolRepository = (): jest.Mocked<ICreateSchoolRepository> => ({
  create: jest.fn(),
  findOne: jest.fn().mockResolvedValue(mockSchool)
});

const makeComplianceApproved = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockResolvedValue({ approved: true })
});

const makeComplianceRejected = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockResolvedValue({ approved: false, reason: "CPF irregular" })
});

const makeComplianceUnavailable = (): jest.Mocked<IComplianceService> => ({
  check: jest.fn().mockRejectedValue(new AppError("Compliance service unavailable", 503))
});

describe("CreateStudentService", () => {
  it("deve criar o aluno quando a escola existe e o compliance aprova", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceApproved()
    );

    const result = await service.execute(studentInput);

    expect(result).toMatchObject({ name: "João Silva", schoolId: "school-id" });
  });

  it("deve lançar AppError quando a escola não existe", async () => {
    const schoolRepo = makeSchoolRepository();
    schoolRepo.findOne.mockResolvedValue(null);

    const service = new CreateStudentService(
      makeStudentRepository(),
      schoolRepo,
      makeComplianceApproved()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({
      message: "School does not exist!",
      statusCode: 400
    });
  });

  it("deve lançar AppError 422 quando o compliance reprova o aluno", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceRejected()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({
      message: "CPF irregular",
      statusCode: 422
    });
  });

  it("deve lançar AppError 503 quando o compliance está indisponível", async () => {
    const service = new CreateStudentService(
      makeStudentRepository(),
      makeSchoolRepository(),
      makeComplianceUnavailable()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({
      message: "Compliance service unavailable",
      statusCode: 503
    });
  });

  it("não deve criar o aluno no banco quando o compliance reprova", async () => {
    const studentRepo = makeStudentRepository();

    const service = new CreateStudentService(
      studentRepo,
      makeSchoolRepository(),
      makeComplianceRejected()
    );

    await expect(service.execute(studentInput)).rejects.toMatchObject({ statusCode: 422 });
    expect(studentRepo.create).not.toHaveBeenCalled();
  });
});
