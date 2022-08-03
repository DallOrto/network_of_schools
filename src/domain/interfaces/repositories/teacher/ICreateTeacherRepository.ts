import {
  CreateTeacherRequest,
  CreateTeacherResponse
} from "../../../dtos/teacher/TeacherDTO";

interface ICreateTeacherRepository {
  create(data: CreateTeacherRequest): Promise<CreateTeacherResponse>;
  findOne(id: string): Promise<CreateTeacherResponse | null>;
}

export { ICreateTeacherRepository };
