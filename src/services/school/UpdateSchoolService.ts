import {
  UpdateSchoolRequest,
  UpdateSchoolResponse
} from "../../domain/dtos/school/UpdateSchoolDTO";
import { ICreateNetworkRepository } from "../../domain/interfaces/repositories/network/ICreateNetworkRepository";
import { IUpdateSchoolRepository } from "../../domain/interfaces/repositories/school/IUpdateSchoolRepository";
import { AppError } from "../../error/AppError";

class UpdateSchoolService {
  private updateSchoolRepository: IUpdateSchoolRepository;
  private networkRepository: ICreateNetworkRepository;

  constructor(
    updateSchoolRepository: IUpdateSchoolRepository,
    networkRepository: ICreateNetworkRepository
  ) {
    this.updateSchoolRepository = updateSchoolRepository;
    this.networkRepository = networkRepository;
  }

  async execute(data: UpdateSchoolRequest): Promise<UpdateSchoolResponse> {
    if (!data.id) {
      throw new AppError("School does not exists!");
    }

    const networkExists = await this.networkRepository.findOne(data.networkId);

    if (!networkExists) {
      throw new AppError("Network does not exist!");
    }

    return this.updateSchoolRepository.updateSchool(data);
  }
}

export { UpdateSchoolService };
