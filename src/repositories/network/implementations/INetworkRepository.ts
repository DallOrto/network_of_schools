import { Network } from ".prisma/client"
import { ICreateNetworkDTO } from "../../../dtos/ICreateNetworkDTO";

interface INetworkRepository {
    create(data: ICreateNetworkDTO): Promise<Network>


}

export { INetworkRepository }