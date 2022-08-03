import {
  CreateNetworkRequest,
  CreateNetworkResponse
} from "../../../dtos/network/NetworkDTO";

interface ICreateNetworkRepository {
  create(data: CreateNetworkRequest): Promise<CreateNetworkResponse>;
  findOne(id: string): Promise<CreateNetworkResponse | null>;
}

export { ICreateNetworkRepository };
