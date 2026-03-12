import bcrypt from "bcryptjs";
import { CreateTeacherService } from "../../../../src/services/teacher/CreateTeacherService";
import { ICreateTeacherRepository } from "../../../../src/domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { ICreateSchoolRepository } from "../../../../src/domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../../../src/error/AppError";

jest.mock("bcryptjs");

const mockTeacherRepository: jest.Mocked<ICreateTeacherRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn()
};

const mockSchoolRepository: jest.Mocked<ICreateSchoolRepository> = {
  create: jest.fn(),
  findOne: jest.fn()
};

const fakeSchool = { id: "school-id", name: "School", address: "Addr", networkId: "net-id", createdAt: new Date(), updatedAt: new Date() };
const fakeTeacherRequest = {
  name: "Jane",
  document: "99999999",
  password: "raw-password",
  birthDate: new Date("1990-05-10"),
  schoolId: "school-id"
};
const fakeTeacherResponse = { ...fakeTeacherRequest, id: "teacher-id", password: "hashed-password", createdAt: new Date(), updatedAt: new Date(), deletedAt: null };

beforeEach(() => jest.clearAllMocks());

describe("CreateTeacherService", () => {
  it("should create a teacher with hashed password when school exists", async () => {
    mockSchoolRepository.findOne.mockResolvedValue(fakeSchool);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    mockTeacherRepository.create.mockResolvedValue(fakeTeacherResponse);

    const service = new CreateTeacherService(mockTeacherRepository, mockSchoolRepository);
    const result = await service.execute(fakeTeacherRequest);

    expect(mockSchoolRepository.findOne).toHaveBeenCalledWith("school-id");
    expect(bcrypt.hash).toHaveBeenCalledWith("raw-password", 10);
    expect(mockTeacherRepository.create).toHaveBeenCalledWith({
      ...fakeTeacherRequest,
      password: "hashed-password"
    });
    expect(result).toEqual(fakeTeacherResponse);
  });

  it("should throw AppError when school does not exist", async () => {
    mockSchoolRepository.findOne.mockResolvedValue(null);

    const service = new CreateTeacherService(mockTeacherRepository, mockSchoolRepository);
    await expect(service.execute(fakeTeacherRequest)).rejects.toMatchObject({
      message: "School does not exist!"
    });

    expect(mockTeacherRepository.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
