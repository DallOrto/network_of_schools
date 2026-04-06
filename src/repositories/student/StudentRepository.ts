import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../domain/dtos/student/StudentDTO";
import { ICreateStudentRepository } from "../../domain/interfaces/repositories/student/ICreateStudentRepository";

class StudentRepository implements ICreateStudentRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async findOne(id: string): Promise<CreateStudentResponse | null> {
    const student = await this.prismaRepository.student.findFirst({
      where: { id, user: { deletedAt: null } },
      include: { user: { select: { document: true, deletedAt: true } } },
    });

    if (!student) return null;

    return {
      id: student.id,
      name: student.name,
      document: student.user.document,
      birthDate: student.birthDate,
      schoolId: student.schoolId,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      deletedAt: student.user.deletedAt,
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.prismaRepository.student.update({
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
  }: CreateStudentRequest): Promise<CreateStudentResponse> {
    const student = await this.prismaRepository.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { document, password, role: "student" },
      });

      return tx.student.create({
        data: { userId: user.id, name, birthDate, schoolId },
        include: { user: { select: { document: true, deletedAt: true } } },
      });
    });

    return {
      id: student.id,
      name: student.name,
      document: student.user.document,
      birthDate: student.birthDate,
      schoolId: student.schoolId,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      deletedAt: student.user.deletedAt,
    };
  }
}

export { StudentRepository };
