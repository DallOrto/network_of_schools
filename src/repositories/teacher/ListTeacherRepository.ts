import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListTeacherFilter, ListTeacherResponse } from "../../domain/dtos/teacher/ListTeacherDTO";
import { IListTeacherRepository } from "../../domain/interfaces/repositories/teacher/IListTeacherRepository";

class ListTeacherRepository implements IListTeacherRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async listTeacher(filter: ListTeacherFilter): Promise<ListTeacherResponse[]> {
    const teachers = await this.prismaRepository.teacher.findMany({
      where: {
        schoolId: filter.schoolId,
        user: { deletedAt: null },
      },
      include: { user: { select: { document: true } } },
    });

    return teachers.map((t) => ({
      id: t.id,
      name: t.name,
      document: t.user.document,
      birthDate: t.birthDate,
      schoolId: t.schoolId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }
}

export { ListTeacherRepository };
