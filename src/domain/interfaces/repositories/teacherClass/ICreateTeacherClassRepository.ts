import { CreateTeacherClassRequest, CreateTeacherClassResponse } from "../../../dtos/teacherClass/TeacherClassDTO"

interface ICreateTeacherClassRepository {
    create(data: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse>
}

export { ICreateTeacherClassRepository }