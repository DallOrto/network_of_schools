import { ListNetworkFilter, ListNetworkResponse } from "../../../../domain/dtos/network/ListNetworkDTO";

export interface IListNetworkRepository {
    listNetwork(filter: ListNetworkFilter): Promise<ListNetworkResponse[]>;
}
