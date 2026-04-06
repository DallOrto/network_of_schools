import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { UpdateStudentRequest, UpdateStudentResponse } from "../../domain/dtos/student/UpdateStudentDTO";
import { IUpdateStudentRepository } from "../../domain/interfaces/repositories/student/IUpdateStudentRepository";

class UpdateStudentRepository implements IUpdateStudentRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async updateStudent(data: UpdateStudentRequest): Promise<UpdateStudentResponse> {
    const student = await this.prismaRepository.student.update({
      where: { id: data.id },
      data: {
        name: data.name,
        birthDate: data.birthDate,
        school: { connect: { id: data.schoolId } },
        user: {
          update: {
            document: data.document,
            password: data.password,
          },
        },
      },
      include: { user: { select: { document: true, deletedAt: true } } },
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

export { UpdateStudentRepository };
