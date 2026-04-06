import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ListStudentInNetworkFilter, ListStudentInNetworkResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentInNetworkRepository } from "../../domain/interfaces/repositories/student/IListStudentInNetworkRepository";

class ListStudentInNetworkRepository implements IListStudentInNetworkRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async listStudentInNetwork(filter: ListStudentInNetworkFilter): Promise<ListStudentInNetworkResponse[]> {
    const students = await this.prismaRepository.student.findMany({
      where: {
        school: { networkId: filter.networkId },
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

export { ListStudentInNetworkRepository };
