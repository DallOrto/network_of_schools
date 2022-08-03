import { ListSchoolFilter, ListSchoolResponse } from "../../../dtos/school/ListSchoolDTO";

export interface IListSchoolRepository {
    listSchools(filter: ListSchoolFilter): Promise<ListSchoolResponse[]>
}

