import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  ListClassTeacherWithStudentFilter,
  ListClassTeacherWithStudentResponse
} from "../../domain/dtos/class/ListClassTeacherWithStudentDTO";
import { IListClassTeacherWithStudentRepository } from "../../domain/interfaces/repositories/class/IListClassTeacherWithStudentRepository";

class ListClassTeacherWithStudentRepository
  implements IListClassTeacherWithStudentRepository
{
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async listClassTeacherWithStudent(
    filter: ListClassTeacherWithStudentFilter
  ): Promise<ListClassTeacherWithStudentResponse[]> {
    return this.prismaRepository.teacherClass.findMany({
      where: {
        teacherId: filter.teacherId
      },
      include: {
        class: {
          select: { StudentClass: { select: { student: true } } }
        }
      }
    });
  }
}

export { ListClassTeacherWithStudentRepository };
