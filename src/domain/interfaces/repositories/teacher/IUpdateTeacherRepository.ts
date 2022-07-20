import { UpdateTeacherRequest, UpdateTeacherResponse } from "../../../dtos/teacher/UpdateTeacherDTO";

export interface IUpdateTeacherRepository {
    updateTeacher(data: UpdateTeacherRequest): Promise<UpdateTeacherResponse>
}