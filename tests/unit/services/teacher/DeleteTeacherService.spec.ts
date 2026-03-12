import { DeleteTeacherService } from "../../../../src/services/teacher/DeleteTeacherService";
import { ICreateTeacherRepository } from "../../../../src/domain/interfaces/repositories/teacher/ICreateTeacherRepository";
import { AppError } from "../../../../src/error/AppError";

const mockTeacherRepository: jest.Mocked<ICreateTeacherRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn()
};

const fakeTeacher = {
  id: "teacher-id",
  name: "Jane",
  document: "99999999",
  password: "hashed",
  birthDate: new Date("1990-05-10"),
  schoolId: "school-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

beforeEach(() => jest.clearAllMocks());

describe("DeleteTeacherService", () => {
  it("should soft delete the teacher when it exists", async () => {
    mockTeacherRepository.findOne.mockResolvedValue(fakeTeacher);

    const service = new DeleteTeacherService(mockTeacherRepository);
    await service.execute("teacher-id");

    expect(mockTeacherRepository.findOne).toHaveBeenCalledWith("teacher-id");
    expect(mockTeacherRepository.softDelete).toHaveBeenCalledWith("teacher-id");
  });

  it("should throw 404 when teacher does not exist", async () => {
    mockTeacherRepository.findOne.mockResolvedValue(null);

    const service = new DeleteTeacherService(mockTeacherRepository);
    await expect(service.execute("non-existent-id")).rejects.toMatchObject({
      message: "Teacher does not exist!",
      statusCode: 404
    });

    expect(mockTeacherRepository.softDelete).not.toHaveBeenCalled();
  });
});
