import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { AuthUser, IAuthRepository } from "../../domain/interfaces/repositories/auth/IAuthRepository";

class AuthRepository implements IAuthRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async findTeacherByDocument(document: string): Promise<AuthUser | null> {
    return this.prismaRepository.teacher.findFirst({
      where: { document, deletedAt: null },
      select: { id: true, document: true, password: true }
    });
  }

  async findStudentByDocument(document: string): Promise<AuthUser | null> {
    return this.prismaRepository.student.findFirst({
      where: { document, deletedAt: null },
      select: { id: true, document: true, password: true }
    });
  }
}

export { AuthRepository };
