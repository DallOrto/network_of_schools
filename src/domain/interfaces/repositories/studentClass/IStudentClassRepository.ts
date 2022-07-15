import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../../dtos/studentClass/ICreateStudentClassDTO";

interface IStudentClassRepository {
    create(data: CreateStudentClassRequest): Promise<CreateStudentClassResponse>
}

export { IStudentClassRepository }