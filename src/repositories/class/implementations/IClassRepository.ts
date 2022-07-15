import { Class } from ".prisma/client"
import { ICreateClassDTO } from "../../../dtos/ICreateClassDTO";

interface IClassRepository {
    create(data: ICreateClassDTO): Promise<Class>


}

export { IClassRepository }