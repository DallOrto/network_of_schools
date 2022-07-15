import { CreateSchoolRequest, CreateSchoolResponse } from "../../../dtos/school/SchoolDTO"

interface ISchoolRepository {
    create(data: CreateSchoolRequest): Promise<CreateSchoolResponse>
}

export { ISchoolRepository }