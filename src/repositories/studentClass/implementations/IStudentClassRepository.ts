import { StudentClass } from ".prisma/client"
import { ICreateStudentClassDTO } from "../../../dtos/ICreateStudentClassDTO";

interface IStudentClassRepository {
    create(data: ICreateStudentClassDTO): Promise<StudentClass>


}

export { IStudentClassRepository }