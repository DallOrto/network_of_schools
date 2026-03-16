import { Student, PrismaClient } from "@prisma/client";
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
    return this.prismaRepository.student.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prismaRepository.student.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async create({
    name,
    document,
    password,
    birthDate,
    schoolId
  }: CreateStudentRequest): Promise<Student> {
    const student = this.prismaRepository.student.create({
      data: {
        name,
        document,
        password,
        birthDate,
        schoolId
      },
      select: {
        id: true,
        name: true,
        document: true,
        birthDate: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }
    });

    return student as unknown as Student;
  }
}

export { StudentRepository };
