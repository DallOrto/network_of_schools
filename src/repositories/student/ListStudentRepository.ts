import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListStudentFilter, ListStudentResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentRepository } from "../../domain/interfaces/repositories/student/IListStudentRepository";

class ListStudentRepository implements IListStudentRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async listStudent(filter: ListStudentFilter): Promise<ListStudentResponse[]> {
    const students = await this.prismaRepository.student.findMany({
      where: {
        schoolId: filter.schoolId,
        user: { deletedAt: null },
      },
      include: { user: { select: { document: true } } },
    });

    return students.map((s) => ({
      id: s.id,
      name: s.name,
      document: s.user.document,
      birthDate: s.birthDate,
      schoolId: s.schoolId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }
}

export { ListStudentRepository };
