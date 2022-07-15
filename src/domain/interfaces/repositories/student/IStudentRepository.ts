import { CreateStudentRequest, CreateStudentResponse } from "../../../dtos/student/StudentDTO"

interface IStudentRepository {
    create(data: CreateStudentRequest): Promise<CreateStudentResponse>
}

export { IStudentRepository }