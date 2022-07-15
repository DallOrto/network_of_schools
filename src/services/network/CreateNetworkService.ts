import { CreateNetworkRequest, CreateNetworkResponse } from "../../domain/dtos/network/NetworkDTO";
import { INetworkRepository } from "../../domain/interfaces/repositories/network/INetworkRepository";

class CreateNetworkService {
    private networkRepository: INetworkRepository;

    constructor(
         networkRepository: INetworkRepository
     ) {
        this.networkRepository = networkRepository;
     }

    async execute({ name }: CreateNetworkRequest): Promise<CreateNetworkResponse>{
        return this.networkRepository.create({ name });
    }
}

export { CreateNetworkService}