import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateEnrollmentAttemptRequest, CreateEnrollmentAttemptResponse } from "../../domain/dtos/enrollmentAttempt/EnrollmentAttemptDTO";
import { ICreateEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
import { IListEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/IListEnrollmentAttemptRepository";
import { ListEnrollmentAttemptResponse } from "../../domain/dtos/enrollmentAttempt/ListEnrollmentAttemptDTO";

class EnrollmentAttemptRepository implements ICreateEnrollmentAttemptRepository, IListEnrollmentAttemptRepository {
    private prismaRepository: PrismaClient;

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create(data: CreateEnrollmentAttemptRequest): Promise<CreateEnrollmentAttemptResponse> {
        return this.prismaRepository.enrollmentAttempt.create({ data });
    }

    async findByDocument(document: string): Promise<ListEnrollmentAttemptResponse[]> {
        return this.prismaRepository.enrollmentAttempt.findMany({
            where: { studentDocument: document },
            select: {
                id: true,
                status: true,
                complianceId: true,
                complianceStudentId: true,
                studentId: true,
                rejectionReason: true,
                attemptedAt: true,
            },
            orderBy: { attemptedAt: "desc" },
        });
    }
}

export { EnrollmentAttemptRepository };
