import {
  CreateSchoolRequest,
  CreateSchoolResponse
} from "../../../dtos/school/SchoolDTO";

interface ICreateSchoolRepository {
  create(data: CreateSchoolRequest): Promise<CreateSchoolResponse>;
  findOne(id: string): Promise<CreateSchoolResponse | null>;
}

export { ICreateSchoolRepository };
