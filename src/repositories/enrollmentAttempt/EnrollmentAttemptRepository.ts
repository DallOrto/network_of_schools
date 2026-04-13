import { PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateEnrollmentAttemptRequest, CreateEnrollmentAttemptResponse } from "../../domain/dtos/enrollmentAttempt/EnrollmentAttemptDTO";
import { ICreateEnrollmentAttemptRepository, UpdateEnrollmentAttemptFromCallbackData } from "../../domain/interfaces/repositories/enrollmentAttempt/ICreateEnrollmentAttemptRepository";
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

    async updateJobId(id: string, complianceJobId: string): Promise<void> {
        await this.prismaRepository.enrollmentAttempt.update({
            where: { id },
            data: { complianceJobId },
        });
    }

    async updateFromCallback(id: string, data: UpdateEnrollmentAttemptFromCallbackData): Promise<CreateEnrollmentAttemptResponse> {
        return this.prismaRepository.enrollmentAttempt.update({
            where: { id },
            data,
        });
    }

    async findById(id: string): Promise<CreateEnrollmentAttemptResponse | null> {
        return this.prismaRepository.enrollmentAttempt.findUnique({
            where: { id },
        });
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
