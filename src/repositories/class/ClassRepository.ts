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
        endTime
      }
    });
  }

  async findOne(id: string): Promise<CreateClassResponse | null> {
    return this.prismaRepository.class.findUnique({
      where: {
        id
      }
    });
  }

  async create({
    name,
    classDay,
    startTime,
    endTime,
    schoolId
  }: CreateClassRequest): Promise<CreateClassResponse> {
    return this.prismaRepository.class.create({
      data: {
        name,
        classDay,
        startTime,
        endTime,
        schoolId
      }
    });
  }
}

export { ClassRepository };
