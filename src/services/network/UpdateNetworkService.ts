import { UpdateNetworkRequest } from "../../domain/dtos/network/NetworkDTO";
import { IUpdateNetworkRepository } from "../../domain/interfaces/repositories/network/IUpdateNetworkRepository";
import { AppError } from "../../error/AppError";
import { NetworkRepository } from "../../repositories/network/NetworkRepository";

class UpdateNetworkService {
    private updateNetworkRepository: IUpdateNetworkRepository;

    constructor(
        updateNetworkRepository: IUpdateNetworkRepository
    ) {
        this.updateNetworkRepository = updateNetworkRepository
    }

    async execute(data: UpdateNetworkRequest){
        if(!data.id) {
            throw new AppError("Network does not exists!")
        }

        return this.updateNetworkRepository.updateNetwork( data );
    }
}

export { UpdateNetworkService }