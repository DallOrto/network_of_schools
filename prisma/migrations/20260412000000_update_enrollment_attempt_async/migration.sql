-- Add PROCESSING to the enum
ALTER TYPE "EnrollmentAttemptStatus" ADD VALUE IF NOT EXISTS 'PROCESSING';

-- Add new columns needed for async student creation
ALTER TABLE "enrollment_attempts"
  ADD COLUMN IF NOT EXISTS "complianceJobId"  TEXT,
  ADD COLUMN IF NOT EXISTS "studentBirthDate" TIMESTAMP(3) NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "hashedPassword"   TEXT NOT NULL DEFAULT '';

-- Remove the temporary defaults (columns now exist, defaults no longer needed)
ALTER TABLE "enrollment_attempts"
  ALTER COLUMN "studentBirthDate" DROP DEFAULT,
  ALTER COLUMN "hashedPassword"   DROP DEFAULT;
