import { EnrollmentAttemptStatus } from "@prisma/client";

interface ListEnrollmentAttemptFilter {
    document: string;
}

interface ListEnrollmentAttemptResponse {
    id: string;
    status: EnrollmentAttemptStatus;
    complianceId: string | null;
    complianceStudentId: string;
    studentId: string | null;
    rejectionReason: string | null;
    attemptedAt: Date;
}

export { ListEnrollmentAttemptFilter, ListEnrollmentAttemptResponse };
