import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { UpdateTeacherRequest, UpdateTeacherResponse } from "../../domain/dtos/teacher/UpdateTeacherDTO";
import { IUpdateTeacherRepository } from "../../domain/interfaces/repositories/teacher/IUpdateTeacherRepository";

class UpdateTeacherRepository implements IUpdateTeacherRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  async updateTeacher(data: UpdateTeacherRequest): Promise<UpdateTeacherResponse> {
    const teacher = await this.prismaRepository.teacher.update({
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

export { UpdateTeacherRepository };
