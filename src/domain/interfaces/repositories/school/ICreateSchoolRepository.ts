import { CreateSchoolRequest, CreateSchoolResponse } from "../../../dtos/school/SchoolDTO"

interface ICreateSchoolRepository {
    create(data: CreateSchoolRequest): Promise<CreateSchoolResponse>
}

export { ICreateSchoolRepository }