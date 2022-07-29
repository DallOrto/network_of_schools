import { UpdateStudentRequest, UpdateStudentResponse } from "../../../dtos/student/UpdateStudentDTO";

export interface IUpdateStudentRepository {
    updateStudent(data: UpdateStudentRequest): Promise<UpdateStudentResponse>
}