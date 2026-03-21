import { CreateAdminRequest, CreateAdminResponse } from "../../../dtos/admin/AdminDTO";

export interface IAdminRepository {
  create(data: CreateAdminRequest & { password: string }): Promise<CreateAdminResponse>;
}
