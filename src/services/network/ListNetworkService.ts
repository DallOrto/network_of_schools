import { ListNetworkFilter, ListNetworkResponse } from "../../domain/dtos/network/ListNetworkDTO";
import { IListNetworkRepository } from "../../domain/interfaces/repositories/network/IListNetworkRepository";

class ListNetworkService {
    private listNetworkRepository: IListNetworkRepository;

    constructor(listNetworkRepository: IListNetworkRepository) {
        this.listNetworkRepository = listNetworkRepository;
    }

    async execute(filter: ListNetworkFilter): Promise<ListNetworkResponse[]> {
        return this.listNetworkRepository.listNetwork(filter);
    }
}

export { ListNetworkService };
