import { CreateNetworkRequest, CreateNetworkResponse } from "../../domain/dtos/network/NetworkDTO";
import { ICreateNetworkRepository } from "../../domain/interfaces/repositories/network/ICreateNetworkRepository";

class CreateNetworkService {
    private networkRepository: ICreateNetworkRepository;

    constructor(
         networkRepository: ICreateNetworkRepository
     ) {
        this.networkRepository = networkRepository;
     }

    async execute({ name }: CreateNetworkRequest): Promise<CreateNetworkResponse>{
        return this.networkRepository.create({ name });
    }
}

export { CreateNetworkService}