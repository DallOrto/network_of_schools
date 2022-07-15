import { CreateNetworkRequest, CreateNetworkResponse } from "../../../dtos/network/NetworkDTO"

interface INetworkRepository {
    create(data: CreateNetworkRequest): Promise<CreateNetworkResponse>
}

export { INetworkRepository }