import bcrypt from "bcryptjs";
import { CreateAdminService } from "../../../../src/services/admin/CreateAdminService";
import { IAdminRepository } from "../../../../src/domain/interfaces/repositories/admin/IAdminRepository";
import { ICreateNetworkRepository } from "../../../../src/domain/interfaces/repositories/network/ICreateNetworkRepository";
import { ICreateSchoolRepository } from "../../../../src/domain/interfaces/repositories/school/ICreateSchoolRepository";

jest.mock("bcryptjs");

const mockAdminRepository: jest.Mocked<IAdminRepository> = {
  create: jest.fn(),
};

const mockNetworkRepository: jest.Mocked<ICreateNetworkRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
};

const mockSchoolRepository: jest.Mocked<ICreateSchoolRepository> = {
  create: jest.fn(),
  findOne: jest.fn(),
};

const fakeNetwork = { id: "net-id", name: "Rede", createdAt: new Date(), updatedAt: new Date() };
const fakeSchool = { id: "school-id", name: "Escola", address: "Rua", networkId: "net-id", createdAt: new Date(), updatedAt: new Date() };

const baseAdminResponse = {
  id: "admin-id",
  name: "Admin",
  document: "11111111",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const baseInput = {
  name: "Admin",
  document: "11111111",
  password: "raw-password",
};

beforeEach(() => jest.clearAllMocks());

describe("CreateAdminService", () => {
  describe("super_admin criando network_admin", () => {
    it("deve criar network_admin quando networkId é válido", async () => {
      mockNetworkRepository.findOne.mockResolvedValue(fakeNetwork);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockAdminRepository.create.mockResolvedValue({
        ...baseAdminResponse,
        role: "network_admin",
        networkId: "net-id",
        schoolId: null,
      });

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);
      const result = await service.execute({
        actorRole: "super_admin",
        ...baseInput,
        role: "network_admin",
        networkId: "net-id",
      });

      expect(mockNetworkRepository.findOne).toHaveBeenCalledWith("net-id");
      expect(bcrypt.hash).toHaveBeenCalledWith("raw-password", 10);
      expect(mockAdminRepository.create).toHaveBeenCalled();
      expect(result.role).toBe("network_admin");
    });

    it("deve lançar 400 quando networkId está ausente", async () => {
      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({ actorRole: "super_admin", ...baseInput, role: "network_admin" })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(mockNetworkRepository.findOne).not.toHaveBeenCalled();
      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar 404 quando a rede não existe", async () => {
      mockNetworkRepository.findOne.mockResolvedValue(null);

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({ actorRole: "super_admin", ...baseInput, role: "network_admin", networkId: "nonexistent" })
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("super_admin criando school_admin", () => {
    it("deve criar school_admin quando schoolId é válido", async () => {
      mockSchoolRepository.findOne.mockResolvedValue(fakeSchool);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockAdminRepository.create.mockResolvedValue({
        ...baseAdminResponse,
        role: "school_admin",
        networkId: null,
        schoolId: "school-id",
      });

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);
      const result = await service.execute({
        actorRole: "super_admin",
        ...baseInput,
        role: "school_admin",
        schoolId: "school-id",
      });

      expect(mockSchoolRepository.findOne).toHaveBeenCalledWith("school-id");
      expect(bcrypt.hash).toHaveBeenCalledWith("raw-password", 10);
      expect(result.role).toBe("school_admin");
    });

    it("deve lançar 400 quando schoolId está ausente", async () => {
      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({ actorRole: "super_admin", ...baseInput, role: "school_admin" })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(mockSchoolRepository.findOne).not.toHaveBeenCalled();
      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar 404 quando a escola não existe", async () => {
      mockSchoolRepository.findOne.mockResolvedValue(null);

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({ actorRole: "super_admin", ...baseInput, role: "school_admin", schoolId: "nonexistent" })
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("network_admin criando school_admin", () => {
    it("deve criar school_admin quando a escola pertence à sua rede", async () => {
      mockSchoolRepository.findOne.mockResolvedValue(fakeSchool); // networkId: "net-id"
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockAdminRepository.create.mockResolvedValue({
        ...baseAdminResponse,
        role: "school_admin",
        networkId: null,
        schoolId: "school-id",
      });

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);
      const result = await service.execute({
        actorRole: "network_admin",
        actorNetworkId: "net-id",
        ...baseInput,
        role: "school_admin",
        schoolId: "school-id",
      });

      expect(result.role).toBe("school_admin");
    });

    it("deve lançar 403 quando tenta criar network_admin", async () => {
      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({
          actorRole: "network_admin",
          actorNetworkId: "net-id",
          ...baseInput,
          role: "network_admin",
          networkId: "net-id",
        })
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar 403 quando a escola pertence a outra rede", async () => {
      mockSchoolRepository.findOne.mockResolvedValue({ ...fakeSchool, networkId: "other-net-id" });

      const service = new CreateAdminService(mockAdminRepository, mockNetworkRepository, mockSchoolRepository);

      await expect(
        service.execute({
          actorRole: "network_admin",
          actorNetworkId: "net-id",
          ...baseInput,
          role: "school_admin",
          schoolId: "school-id",
        })
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });
  });
});
