import { DeleteStudentService } from "../../../../src/services/student/DeleteStudentService";
import { ICreateStudentRepository } from "../../../../src/domain/interfaces/repositories/student/ICreateStudentRepository";
import { AppError } from "../../../../src/error/AppError";

const mockStudentRepository: jest.Mocked<ICreateStudentRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn()
};

const fakeStudent = {
  id: "student-id",
  name: "John",
  document: "12345678",
  password: "hashed",
  birthDate: new Date("2000-01-01"),
  schoolId: "school-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

beforeEach(() => jest.clearAllMocks());

describe("DeleteStudentService", () => {
  it("should soft delete the student when it exists", async () => {
    mockStudentRepository.findOne.mockResolvedValue(fakeStudent);

    const service = new DeleteStudentService(mockStudentRepository);
    await service.execute("student-id");

    expect(mockStudentRepository.findOne).toHaveBeenCalledWith("student-id");
    expect(mockStudentRepository.softDelete).toHaveBeenCalledWith("student-id");
  });

  it("should throw 404 when student does not exist", async () => {
    mockStudentRepository.findOne.mockResolvedValue(null);

    const service = new DeleteStudentService(mockStudentRepository);
    await expect(service.execute("non-existent-id")).rejects.toMatchObject({
      message: "Student does not exist!",
      statusCode: 404
    });

    expect(mockStudentRepository.softDelete).not.toHaveBeenCalled();
  });
});
