import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../../../../src/services/auth/AuthService";
import { IAuthRepository } from "../../../../src/domain/interfaces/repositories/auth/IAuthRepository";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  findTeacherByDocument: jest.fn(),
  findStudentByDocument: jest.fn(),
  findAdminByDocument: jest.fn(),
};

const fakeUser = { id: "user-id", document: "12345678", password: "hashed-password" };
const fakeUserWithSchool = { id: "user-id", document: "12345678", password: "hashed-password", schoolId: "school-123" };

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

    it("should include schoolId in JWT payload when teacher has schoolId", async () => {
      mockAuthRepository.findTeacherByDocument.mockResolvedValue(fakeUserWithSchool);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      await service.execute({ document: "12345678", password: "correct-password", role: "teacher" });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeUserWithSchool.id, document: fakeUserWithSchool.document, role: "teacher", schoolId: "school-123" },
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
      mockAuthRepository.findAdminByDocument.mockResolvedValue(fakeAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      const result = await service.execute({
        document: "admin-doc",
        password: "correct-password",
        role: "school_admin"
      });

      expect(result).toEqual({ token: "jwt-token" });
      expect(mockAuthRepository.findAdminByDocument).toHaveBeenCalledWith("admin-doc");
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
      mockAuthRepository.findAdminByDocument.mockResolvedValue(fakeNetworkAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const service = new AuthService(mockAuthRepository);
      await service.execute({ document: "netadmin-doc", password: "password", role: "network_admin" });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "netadmin-id", document: "netadmin-doc", role: "network_admin", networkId: "net-456" },
        "test-secret",
        { expiresIn: "1d" }
      );
    });

    it("should throw 401 when admin role in DB does not match requested role", async () => {
      const fakeAdmin = {
        id: "admin-id",
        document: "admin-doc",
        password: "hashed-password",
        role: "network_admin", // role real no banco
      };
      mockAuthRepository.findAdminByDocument.mockResolvedValue(fakeAdmin);

      const service = new AuthService(mockAuthRepository);
      // Tenta logar como super_admin, mas o banco diz que é network_admin
      await expect(
        service.execute({ document: "admin-doc", password: "any", role: "super_admin" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });

    it("should throw 401 when admin is not found", async () => {
      mockAuthRepository.findAdminByDocument.mockResolvedValue(null);

      const service = new AuthService(mockAuthRepository);
      await expect(
        service.execute({ document: "nonexistent", password: "any", role: "super_admin" })
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
