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
    return this.prismaRepository.teacher.findUnique({
      where: {
        id
      }
    });
  }

  async create({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateTeacherRequest): Promise<CreateTeacherResponse> {
    return this.prismaRepository.teacher.create({
      data: {
        name,
        document,
        password,
        birthDate,
        schoolId
      }
    });
  }
}

export { TeacherRepository };
