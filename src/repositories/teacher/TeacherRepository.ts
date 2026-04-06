import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  CreateTeacherRequest,
  CreateTeacherResponse
} from "../../domain/dtos/teacher/TeacherDTO";
import { ICreateTeacherRepository } from "../../domain/interfaces/repositories/teacher/ICreateTeacherRepository";

class TeacherRepository implements ICreateTeacherRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async findOne(id: string): Promise<CreateTeacherResponse | null> {
    const teacher = await this.prismaRepository.teacher.findFirst({
      where: { id, user: { deletedAt: null } },
      include: { user: { select: { document: true, deletedAt: true } } },
    });

    if (!teacher) return null;

    return {
      id: teacher.id,
      name: teacher.name,
      document: teacher.user.document,
      birthDate: teacher.birthDate,
      schoolId: teacher.schoolId,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      deletedAt: teacher.user.deletedAt,
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.prismaRepository.teacher.update({
      where: { id },
      data: { user: { update: { deletedAt: new Date() } } },
    });
  }

  async create({
    name,
    document,
    password,
    birthDate,
    schoolId,
  }: CreateTeacherRequest): Promise<CreateTeacherResponse> {
    const teacher = await this.prismaRepository.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { document, password, role: "teacher" },
      });

      return tx.teacher.create({
        data: { userId: user.id, name, birthDate, schoolId },
        include: { user: { select: { document: true, deletedAt: true } } },
      });
    });

    return {
      id: teacher.id,
      name: teacher.name,
      document: teacher.user.document,
      birthDate: teacher.birthDate,
      schoolId: teacher.schoolId,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
      deletedAt: teacher.user.deletedAt,
    };
  }
}

export { TeacherRepository };
