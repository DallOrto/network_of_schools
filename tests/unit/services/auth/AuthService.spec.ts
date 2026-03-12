import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../../../../src/services/auth/AuthService";
import { IAuthRepository } from "../../../../src/domain/interfaces/repositories/auth/IAuthRepository";
import { AppError } from "../../../../src/error/AppError";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  findTeacherByDocument: jest.fn(),
  findStudentByDocument: jest.fn()
};

const fakeUser = { id: "user-id", document: "12345678", password: "hashed-password" };

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret";
  jest.clearAllMocks();
});

afterEach(() => {
  delete process.env.JWT_SECRET;
});

describe("AuthService", () => {
  describe("teacher login", () => {
    it("should return a token when credentials are valid", async () => {
      mockAuthRepository.findTeacherByDocument.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({
        document: "12345678",
        password: "correct-password",
        role: "teacher"
      });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findTeacherByDocument).toHaveBeenCalledWith("12345678");
      expect(bcrypt.compare).toHaveBeenCalledWith("correct-password", "hashed-password");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeUser.id, document: fakeUser.document, role: "teacher" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });

    it("should throw 401 when teacher is not found", async () => {
      mockAuthRepository.findTeacherByDocument.mockResolvedValue(null);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "00000000", password: "any", role: "teacher" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });

    it("should throw 401 when password does not match", async () => {
      mockAuthRepository.findTeacherByDocument.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "12345678", password: "wrong-password", role: "teacher" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });
  });

  describe("student login", () => {
    it("should return a token when credentials are valid", async () => {
      mockAuthRepository.findStudentByDocument.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({
        document: "12345678",
        password: "correct-password",
        role: "student"
      });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findStudentByDocument).toHaveBeenCalledWith("12345678");
    });

    it("should throw 401 when student is not found", async () => {
      mockAuthRepository.findStudentByDocument.mockResolvedValue(null);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "00000000", password: "any", role: "student" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });
  });

  describe("JWT_SECRET", () => {
    it("should throw 500 when JWT_SECRET is not set", async () => {
      delete process.env.JWT_SECRET;
      mockAuthRepository.findTeacherByDocument.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "12345678", password: "password", role: "teacher" })
      ).rejects.toMatchObject({ message: "JWT secret not configured", statusCode: 500 });
    });
  });
});
