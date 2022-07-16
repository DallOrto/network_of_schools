import { CreateStudentRequest, CreateStudentResponse } from "../../../dtos/student/StudentDTO"

interface ICreateStudentRepository {
    create(data: CreateStudentRequest): Promise<CreateStudentResponse>
}

export { ICreateStudentRepository }