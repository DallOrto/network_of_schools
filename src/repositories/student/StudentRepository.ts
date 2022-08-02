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
    return this.prismaRepository.student.findUnique({
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
  }: CreateStudentRequest): Promise<Student> {
    const student = this.prismaRepository.student.create({
      data: {
        name,
        document,
        password,
        birthDate,
        schoolId
      }
    });

    return student;
  }
}

export { StudentRepository };
