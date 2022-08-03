import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import {
  CreateNetworkRequest,
  CreateNetworkResponse
} from "../../domain/dtos/network/NetworkDTO";
import { ICreateNetworkRepository } from "../../domain/interfaces/repositories/network/ICreateNetworkRepository";

class NetworkRepository implements ICreateNetworkRepository {
  private prismaRepository: PrismaClient;

  constructor() {
    this.prismaRepository = prismaDB;
  }
  async findOne(id: string): Promise<CreateNetworkResponse | null> {
    return this.prismaRepository.network.findUnique({
      where: {
        id
      }
    });
  }

  async create({ name }: CreateNetworkRequest): Promise<CreateNetworkResponse> {
    return this.prismaRepository.network.create({
      data: {
        name
      }
    });
  }
}

export { NetworkRepository };
