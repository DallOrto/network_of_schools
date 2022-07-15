import { Student } from ".prisma/client"
import { ICreateStudentDTO } from "../../../dtos/ICreateStudentDTO";

interface IStudentRepository {
    create(data: ICreateStudentDTO): Promise<Student>
}

export { IStudentRepository }