import { Teacher } from ".prisma/client"
import { ICreateTeacherDTO } from "../../../dtos/ICreateTeacherDTO";

interface ITeacherRepository {
    create(data: ICreateTeacherDTO): Promise<Teacher>
}

export { ITeacherRepository }