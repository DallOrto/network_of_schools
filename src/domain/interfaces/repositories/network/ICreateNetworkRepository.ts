import { CreateNetworkRequest, CreateNetworkResponse } from "../../../dtos/network/NetworkDTO"

interface ICreateNetworkRepository {
    create(data: CreateNetworkRequest): Promise<CreateNetworkResponse>
}

export { ICreateNetworkRepository }