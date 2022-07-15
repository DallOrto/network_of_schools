import { CreateTeacherClassRequest, CreateTeacherClassResponse } from "../../../dtos/teacherClass/TeacherClassDTO"

interface ITeacherClassRepository {
    create(data: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse>
}

export { ITeacherClassRepository }