import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../../dtos/studentClass/StudentClassDTO"

interface ICreateStudentClassRepository {
    create(data: CreateStudentClassRequest): Promise<CreateStudentClassResponse>
}

export { ICreateStudentClassRepository }