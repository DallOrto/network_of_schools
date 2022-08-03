import {
  CreateClassRequest,
  CreateClassResponse
} from "../../../dtos/class/ClassDTO";

interface ICreateClassRepository {
  create(data: CreateClassRequest): Promise<CreateClassResponse>;
  findOne(id: string): Promise<CreateClassResponse | null>;
}

export { ICreateClassRepository };
