import { School } from ".prisma/client"
import { ICreateSchoolDTO } from "../../../dtos/ICreateSchoolDTO";

interface ISchoolRepository {
    create(data: ICreateSchoolDTO): Promise<School>
}

export { ISchoolRepository }