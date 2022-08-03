import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../../dtos/student/StudentDTO";

interface ICreateStudentRepository {
  create(data: CreateStudentRequest): Promise<CreateStudentResponse>;
  findOne(id: string): Promise<CreateStudentResponse | null>;
}

export { ICreateStudentRepository };
