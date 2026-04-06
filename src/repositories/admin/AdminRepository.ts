import { prismaDB } from "../../database/prismaClient";
import { CreateAdminRequest, CreateAdminResponse } from "../../domain/dtos/admin/AdminDTO";
import { IAdminRepository } from "../../domain/interfaces/repositories/admin/IAdminRepository";

class AdminRepository implements IAdminRepository {
  async create(data: CreateAdminRequest): Promise<CreateAdminResponse> {
    const admin = await prismaDB.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          document: data.document,
          password: data.password,
          role: data.role,
        },
      });

      return tx.admin.create({
        data: {
          userId: user.id,
          name: data.name,
          networkId: data.networkId ?? null,
          schoolId: data.schoolId ?? null,
        },
        include: {
          user: { select: { document: true, role: true } },
        },
      });
    });

    return {
      id: admin.id,
      name: admin.name,
      document: admin.user.document,
      role: admin.user.role,
      networkId: admin.networkId,
      schoolId: admin.schoolId,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}

export { AdminRepository };
