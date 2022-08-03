import { CreateTeacherRequest, CreateTeacherResponse } from "../../../dtos/teacher/TeacherDTO"

interface ICreateTeacherRepository {
    create(data: CreateTeacherRequest): Promise<CreateTeacherResponse>
}

export { ICreateTeacherRepository }