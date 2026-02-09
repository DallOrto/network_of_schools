import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  UpdateClassRequest,
  UpdateClassResponse
} from "../../domain/dtos/class/UpdateClassDTO";
import { IUpdateClassRepository } from "../../domain/interfaces/repositories/class/IUpdateClassRepository";

class UpdateClassRepository implements IUpdateClassRepository {
  private updateClassRepository: PrismaClient;

  constructor() {
    this.updateClassRepository = prismaDB;
  }

  async updateClass(data: UpdateClassRequest): Promise<UpdateClassResponse> {
    return this.updateClassRepository.class.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        classDay: data.classDay,
        startTime: data.startTime,
        endTime: data.endTime,
        schoolId: data.schoolId,
        maxStudents: data.maxStudents
      }
    });
  }
}

export { UpdateClassRepository };
