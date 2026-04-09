import { EnrollmentAttemptStatus } from "@prisma/client";

interface CreateEnrollmentAttemptRequest {
    complianceStudentId: string;
    studentId?: string;
    studentName: string;
    studentDocument: string;
    schoolId: string;
    status: EnrollmentAttemptStatus;
    complianceId?: string;
    rejectionReason?: string | null;
}

interface CreateEnrollmentAttemptResponse {
    id: string;
    complianceStudentId: string;
    studentId: string | null;
    studentName: string;
    studentDocument: string;
    schoolId: string;
    status: EnrollmentAttemptStatus;
    complianceId: string | null;
    rejectionReason: string | null;
    attemptedAt: Date;
}

export { CreateEnrollmentAttemptRequest, CreateEnrollmentAttemptResponse };
