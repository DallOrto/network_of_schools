import { PrismaClient } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  ListClassStudentFilter,
  ListClassStudentResponse
} from "../../domain/dtos/class/ListClassStudentDTO";
import { IListClassStudentRepository } from "../../domain/interfaces/repositories/class/IListClassStudentRepository";

class ListClassStudentRepository implements IListClassStudentRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async listClassStudent(
    filter: ListClassStudentFilter
  ): Promise<ListClassStudentResponse[]> {
    return this.prismaRepository.studentClass.findMany({
      where: {
        studentId: filter.studentId
      }
    });
  }
}

export { ListClassStudentRepository };
