import {
  CreateSchoolRequest,
  CreateSchoolResponse
} from "../../domain/dtos/school/SchoolDTO";
import { ICreateNetworkRepository } from "../../domain/interfaces/repositories/network/ICreateNetworkRepository";
import { ICreateSchoolRepository } from "../../domain/interfaces/repositories/school/ICreateSchoolRepository";
import { AppError } from "../../error/AppError";

class CreateSchoolService {
  private schoolRepository: ICreateSchoolRepository;
  private networkRepository: ICreateNetworkRepository;

  constructor(
    schoolRepository: ICreateSchoolRepository,
    networkRepository: ICreateNetworkRepository
  ) {
    this.schoolRepository = schoolRepository;
    this.networkRepository = networkRepository;
  }

  async execute({
    name,
    address,
    networkId
  }: CreateSchoolRequest): Promise<CreateSchoolResponse> {
    const networkExists = await this.networkRepository.findOne(networkId);

    if (!networkExists) {
      throw new AppError("Network does not exist!");
    }

    return this.schoolRepository.create({ name, address, networkId });
  }
}

export { CreateSchoolService };
