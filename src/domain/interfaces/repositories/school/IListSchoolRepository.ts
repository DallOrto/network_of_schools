import { ListSchoolFilter, ListSchoolResponse } from "../../../dtos/school/ListSchoolDTO";

interface IListSchoolRepository {
    listSchools(filter: ListSchoolFilter): Promise<ListSchoolResponse[]>
}

export { IListSchoolRepository }