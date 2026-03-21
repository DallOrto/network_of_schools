import bcrypt from "bcryptjs";
import { CreateAdminRequest, CreateAdminResponse } from "../../domain/dtos/admin/AdminDTO";
import { IAdminRepository } from "../../domain/interfaces/repositories/admin/IAdminRepository";
import { ICreateNetworkRepository } from "../../domain/interfaces/repositories/network/ICreateNetworkRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../error/AppError";

interface ExecuteParams extends CreateAdminRequest {
  actorRole: string;
  actorNetworkId?: string;
}

class CreateAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private networkRepository: ICreateNetworkRepository,
    private schoolRepository: ICreateSchoolRepository,
  ) {}

  async execute({
    actorRole,
    actorNetworkId,
    name,
    document,
    password,
    role,
    networkId,
    schoolId,
  }: ExecuteParams): Promise<CreateAdminResponse> {
    // network_admin só pode criar school_admin
    if (actorRole === "network_admin" && role !== "school_admin") {
      throw new AppError("network_admin só pode criar school_admin", 403);
    }

    if (role === "network_admin") {
      if (!networkId) {
        throw new AppError("networkId é obrigatório para criar um network_admin", 400);
      }
      const network = await this.networkRepository.findOne(networkId);
      if (!network) {
        throw new AppError("Rede não encontrada", 404);
      }
    }

    if (role === "school_admin") {
      if (!schoolId) {
        throw new AppError("schoolId é obrigatório para criar um school_admin", 400);
      }
      const school = await this.schoolRepository.findOne(schoolId);
      if (!school) {
        throw new AppError("Escola não encontrada", 404);
      }

      // network_admin só pode criar school_admin dentro da sua rede
      if (actorRole === "network_admin") {
        if (school.networkId !== actorNetworkId) {
          throw new AppError("Você só pode criar administradores em escolas da sua própria rede", 403);
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.adminRepository.create({
      name,
      document,
      password: hashedPassword,
      role,
      networkId,
      schoolId,
    });
  }
}

export { CreateAdminService };
