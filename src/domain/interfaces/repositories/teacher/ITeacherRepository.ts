import { CreateTeacherRequest, CreateTeacherResponse } from "../../../dtos/teacher/TeacherDTO"

interface ITeacherRepository {
    create(data: CreateTeacherRequest): Promise<CreateTeacherResponse>
}

export { ITeacherRepository }