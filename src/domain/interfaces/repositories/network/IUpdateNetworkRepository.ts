import { CreateNetworkResponse, UpdateNetworkRequest } from "../../../dtos/network/NetworkDTO"

interface IUpdateNetworkRepository {
    updateNetwork(data: UpdateNetworkRequest): Promise<CreateNetworkResponse>
}

export { IUpdateNetworkRepository }