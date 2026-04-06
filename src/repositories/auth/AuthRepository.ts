import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { AuthUser, IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";

class AuthRepository implements IAuthRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async findByDocument(document: string): Promise<AuthUser | null> {
    const user = await this.prismaRepository.user.findFirst({
      where: { document, deletedAt: null },
      include: {
        teacher: { select: { schoolId: true } },
        student: { select: { schoolId: true } },
        admin: { select: { schoolId: true, networkId: true } },
      },
    });

    if (!user) return null;

    const schoolId =
      user.teacher?.schoolId ?? user.student?.schoolId ?? user.admin?.schoolId ?? undefined;
    const networkId = user.admin?.networkId ?? undefined;

    return {
      id: user.id,
      document: user.document,
      password: user.password,
      role: user.role,
      schoolId,
      networkId,
    };
  }
}

export { AuthRepository };
