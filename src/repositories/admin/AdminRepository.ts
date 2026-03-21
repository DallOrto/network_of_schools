import { prismaDB } from "../../database/prismaClient";
import { CreateAdminRequest, CreateAdminResponse } from "../../domain/dtos/admin/AdminDTO";
import { IAdminRepository } from "../../domain/interfaces/repositories/admin/IAdminRepository";

class AdminRepository implements IAdminRepository {
  async create(data: CreateAdminRequest): Promise<CreateAdminResponse> {
    const admin = await prismaDB.admin.create({
      data: {
        name: data.name,
        document: data.document,
        password: data.password,
        role: data.role,
        networkId: data.networkId ?? null,
        schoolId: data.schoolId ?? null,
      },
      select: {
        id: true,
        name: true,
        document: true,
        role: true,
        networkId: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }
}

export { AdminRepository };
