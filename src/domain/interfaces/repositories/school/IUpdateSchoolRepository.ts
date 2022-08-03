import { UpdateSchoolRequest, UpdateSchoolResponse } from "../../../dtos/school/UpdateSchoolDTO";

export interface IUpdateSchoolRepository {
    updateSchool(data:UpdateSchoolRequest):Promise<UpdateSchoolResponse>
}