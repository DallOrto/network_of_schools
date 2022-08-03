import { UpdateStudentRequest, UpdateStudentResponse } from "../../../dtos/student/updateStudentDTO";

export interface IUpdateStudentRepository {
    updateStudent(data: UpdateStudentRequest): Promise<UpdateStudentResponse>
}