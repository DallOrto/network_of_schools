import { CreateEnrollmentAttemptRequest, CreateEnrollmentAttemptResponse } from "../../../dtos/enrollmentAttempt/EnrollmentAttemptDTO";
import { EnrollmentAttemptStatus } from "@prisma/client";

interface UpdateEnrollmentAttemptFromCallbackData {
    status: EnrollmentAttemptStatus;
    complianceStudentId: string;
    complianceId: string;
    studentId?: string;
    rejectionReason?: string | null;
}

interface ICreateEnrollmentAttemptRepository {
    create(data: CreateEnrollmentAttemptRequest): Promise<CreateEnrollmentAttemptResponse>;
    updateJobId(id: string, complianceJobId: string): Promise<void>;
    updateFromCallback(id: string, data: UpdateEnrollmentAttemptFromCallbackData): Promise<CreateEnrollmentAttemptResponse>;
    findById(id: string): Promise<CreateEnrollmentAttemptResponse | null>;
}

export { ICreateEnrollmentAttemptRepository, UpdateEnrollmentAttemptFromCallbackData };
