import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { AuthUser, IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";

class AuthRepository implements IAuthRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async findTeacherByDocument(document: string): Promise<AuthUser | null> {
    const teacher = await this.prismaRepository.teacher.findFirst({
      where: { document, deletedAt: null },
      select: { id: true, document: true, password: true, schoolId: true },
    });

    if (!teacher) return null;

    return {
      id: teacher.id,
      document: teacher.document,
      password: teacher.password,
      schoolId: teacher.schoolId,
    };
  }

  async findStudentByDocument(document: string): Promise<AuthUser | null> {
    const student = await this.prismaRepository.student.findFirst({
      where: { document, deletedAt: null },
      select: { id: true, document: true, password: true, schoolId: true },
    });

    if (!student) return null;

    return {
      id: student.id,
      document: student.document,
      password: student.password,
      schoolId: student.schoolId,
    };
  }

  async findAdminByDocument(document: string): Promise<AuthUser | null> {
    const admin = await this.prismaRepository.admin.findFirst({
      where: { document, deletedAt: null },
      select: { id: true, document: true, password: true, role: true, networkId: true, schoolId: true },
    });

    if (!admin) return null;

    return {
      id: admin.id,
      document: admin.document,
      password: admin.password,
      role: admin.role,
      networkId: admin.networkId ?? undefined,
      schoolId: admin.schoolId ?? undefined,
    };
  }
}

export { AuthRepository };
