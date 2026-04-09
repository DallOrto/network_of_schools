-- CreateEnum
CREATE TYPE "EnrollmentAttemptStatus" AS ENUM ('APPROVED', 'REJECTED', 'ERROR');

-- CreateTable
CREATE TABLE "enrollment_attempts" (
    "id" TEXT NOT NULL,
    "complianceStudentId" TEXT NOT NULL,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "studentDocument" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "status" "EnrollmentAttemptStatus" NOT NULL,
    "complianceId" TEXT,
    "rejectionReason" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_attempts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enrollment_attempts" ADD CONSTRAINT "enrollment_attempts_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
