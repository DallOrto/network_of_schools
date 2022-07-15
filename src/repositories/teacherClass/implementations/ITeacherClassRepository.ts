import { TeacherClass } from ".prisma/client"
import { ICreateTeacherClassDTO } from "../../../dtos/ICreateTeacherClassDTO";

interface ITeacherClassRepository {
    create(data: ICreateTeacherClassDTO): Promise<TeacherClass>


}

export { ITeacherClassRepository }