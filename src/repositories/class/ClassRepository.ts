import { PrismaClient, WeekDays } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  CreateClassRequest,
  CreateClassResponse
} from "../../domain/dtos/class/ClassDTO";
import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";

class ClassRepository implements ICreateClassRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }

  findOneClass(
    name: string,
    classDay: WeekDays,
    startTime: string,
    endTime: string
  ): Promise<CreateClassResponse | null> {
    return this.prismaRepository.class.findFirst({
      where: {
        name,
        classDay,
        startTime,
        endTime,
        deletedAt: null            
      }
    });
  }

  async findOne(id: string): Promise<CreateClassResponse | null> {
    return this.prismaRepository.class.findFirst({
      where: {
        id,
        deletedAt: null             
      }
    });
  }

  async create({
    name,
    classDay,
    startTime,
    endTime,
    schoolId,
    maxStudents
  }: CreateClassRequest): Promise<CreateClassResponse> {
    return this.prismaRepository.class.create({
      data: {
        name,
        classDay,
        startTime,
        endTime,
        schoolId,
        maxStudents
      }
    });
  }

  // MÉTODO NOVO: realiza o soft delete
  async softDelete(id: string): Promise<void> {
    await this.prismaRepository.class.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}

export { ClassRepository };