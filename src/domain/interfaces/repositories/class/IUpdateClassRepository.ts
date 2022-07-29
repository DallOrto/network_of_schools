import { UpdateClassRequest, UpdateClassResponse } from "../../../dtos/class/UpdateClassDTO";

export interface IUpdateClassRepository {
    updateClass(data: UpdateClassRequest): Promise<UpdateClassResponse>
}