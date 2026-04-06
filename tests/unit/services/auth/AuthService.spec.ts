import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../../../../src/services/auth/AuthService";
import { IAuthRepository } from "../../../../src/domain/interfaces/repositories/auth/IAuthRepository";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  findByDocument: jest.fn(),
};

const fakeTeacher = { id: "user-id", document: "12345678", password: "hashed-password", role: "teacher" };
const fakeTeacherWithSchool = { id: "user-id", document: "12345678", password: "hashed-password", role: "teacher", schoolId: "school-123" };

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
      mockAuthRepository.findByDocument.mockResolvedValue(fakeTeacher);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({
        document: "12345678",
        password: "correct-password",
      });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findByDocument).toHaveBeenCalledWith("12345678");
      expect(bcrypt.compare).toHaveBeenCalledWith("correct-password", "hashed-password");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeTeacher.id, document: fakeTeacher.document, role: "teacher" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });

    it("should include schoolId in JWT payload when teacher has schoolId", async () => {
      mockAuthRepository.findByDocument.mockResolvedValue(fakeTeacherWithSchool);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      await service.execute({ document: "12345678", password: "correct-password" });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeTeacherWithSchool.id, document: fakeTeacherWithSchool.document, role: "teacher", schoolId: "school-123" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });

    it("should throw 401 when user is not found", async () => {
      mockAuthRepository.findByDocument.mockResolvedValue(null);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "00000000", password: "any" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });

    it("should throw 401 when password does not match", async () => {
      mockAuthRepository.findByDocument.mockResolvedValue(fakeTeacher);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "12345678", password: "wrong-password" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });
  });

  describe("student login", () => {
    it("should return a token when credentials are valid", async () => {
      const fakeStudent = { id: "user-id", document: "12345678", password: "hashed-password", role: "student", schoolId: "school-123" };
      mockAuthRepository.findByDocument.mockResolvedValue(fakeStudent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({ document: "12345678", password: "correct-password" });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findByDocument).toHaveBeenCalledWith("12345678");
    });
  });

  describe("admin login", () => {
    it("should return a token when school_admin credentials are valid", async () => {
      const fakeAdmin = {
        id: "admin-id",
        document: "admin-doc",
        password: "hashed-password",
        role: "school_admin",
        schoolId: "school-123",
        networkId: "net-456",
      };
      mockAuthRepository.findByDocument.mockResolvedValue(fakeAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({ document: "admin-doc", password: "correct-password" });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findByDocument).toHaveBeenCalledWith("admin-doc");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "admin-id", document: "admin-doc", role: "school_admin", schoolId: "school-123", networkId: "net-456" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });

    it("should include only networkId in JWT when network_admin has no schoolId", async () => {
      const fakeNetworkAdmin = {
        id: "netadmin-id",
        document: "netadmin-doc",
        password: "hashed-password",
        role: "network_admin",
        networkId: "net-456",
      };
      mockAuthRepository.findByDocument.mockResolvedValue(fakeNetworkAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      await service.execute({ document: "netadmin-doc", password: "password" });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "netadmin-id", document: "netadmin-doc", role: "network_admin", networkId: "net-456" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });
  });

  describe("JWT_SECRET", () => {
    it("should throw 500 when JWT_SECRET is not set", async () => {
      delete process.env.JWT_SECRET;
      mockAuthRepository.findByDocument.mockResolvedValue(fakeTeacher);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "12345678", password: "password" })
      ).rejects.toMatchObject({ message: "JWT secret not configured", statusCode: 500 });
    });
  });
});
