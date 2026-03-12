import bcrypt from "bcryptjs";
import { CreateStudentService } from "../../../../src/services/student/CreateStudentService";
import { ICreateStudentRepository } from "../../../../src/domain/interfaces/repositories/student/ICreateStudentRepository";
import { ICreateSchoolRepository } from "../../../../src/domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../../../src/error/AppError";

jest.mock("bcryptjs");

const mockStudentRepository: jest.Mocked<ICreateStudentRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn()
};

const mockSchoolRepository: jest.Mocked<ICreateSchoolRepository> = {
  create: jest.fn(),
  findOne: jest.fn()
};

const fakeSchool = { id: "school-id", name: "School", address: "Addr", networkId: "net-id", createdAt: new Date(), updatedAt: new Date() };
const fakeStudentRequest = {
  name: "John",
  document: "12345678",
  password: "raw-password",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id"
};
const fakeStudentResponse = { ...fakeStudentRequest, id: "student-id", password: "hashed-password", createdAt: new Date(), updatedAt: new Date(), deletedAt: null };

beforeEach(() => jest.clearAllMocks());

describe("CreateStudentService", () => {
  it("should create a student with hashed password when school exists", async () => {
    mockSchoolRepository.findOne.mockResolvedValue(fakeSchool);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    mockStudentRepository.create.mockResolvedValue(fakeStudentResponse);

    const service = new CreateStudentService(mockStudentRepository, mockSchoolRepository);
    const result = await service.execute(fakeStudentRequest);

    expect(mockSchoolRepository.findOne).toHaveBeenCalledWith("school-id");
    expect(bcrypt.hash).toHaveBeenCalledWith("raw-password", 10);
    expect(mockStudentRepository.create).toHaveBeenCalledWith({
      ...fakeStudentRequest,
      password: "hashed-password"
    });
    expect(result).toEqual(fakeStudentResponse);
  });

  it("should throw AppError when school does not exist", async () => {
    mockSchoolRepository.findOne.mockResolvedValue(null);

    const service = new CreateStudentService(mockStudentRepository, mockSchoolRepository);
    await expect(service.execute(fakeStudentRequest)).rejects.toMatchObject({
      message: "School does not exist!"
    });

    expect(mockStudentRepository.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
