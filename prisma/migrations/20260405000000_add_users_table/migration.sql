-- CreateEnum (idempotente)
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('super_admin', 'network_admin', 'school_admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable users (idempotente)
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_document_key" ON "users"("document");

-- Adiciona userId como nullable (idempotente)
ALTER TABLE "admins" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Migra admins existentes sem userId ainda (ON CONFLICT evita colisão de documents)
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), a."document", a."password", a."role"::text::"UserRole", a."deletedAt", a."createdAt", a."updatedAt"
FROM "admins" a
WHERE a."userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "admins" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "admins"."document"
)
WHERE "userId" IS NULL;

-- Para admins com document duplicado dentro da tabela (fallback com document sintético)
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'dup_admin_' || "id", "password", "role"::text::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "admins"
WHERE "userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "admins" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = 'dup_admin_' || "admins"."id"
)
WHERE "userId" IS NULL;

-- Migra teachers existentes sem userId ainda
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), t."document", t."password", 'teacher'::"UserRole", t."deletedAt", t."createdAt", t."updatedAt"
FROM "teachers" t
WHERE t."userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "teachers" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "teachers"."document"
)
WHERE "userId" IS NULL;

-- Para teachers com document duplicado
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'dup_teacher_' || "id", "password", 'teacher'::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "teachers"
WHERE "userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "teachers" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = 'dup_teacher_' || "teachers"."id"
)
WHERE "userId" IS NULL;

-- Migra students existentes sem userId ainda
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), s."document", s."password", 'student'::"UserRole", s."deletedAt", s."createdAt", s."updatedAt"
FROM "students" s
WHERE s."userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "students" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "students"."document"
)
WHERE "userId" IS NULL;

-- Para students com document duplicado
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'dup_student_' || "id", "password", 'student'::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "students"
WHERE "userId" IS NULL
ON CONFLICT ("document") DO NOTHING;

UPDATE "students" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = 'dup_student_' || "students"."id"
)
WHERE "userId" IS NULL;

-- Torna userId obrigatório
ALTER TABLE "admins" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "teachers" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "students" ALTER COLUMN "userId" SET NOT NULL;

-- Remove colunas de identidade das tabelas de perfil (idempotente)
DROP INDEX IF EXISTS "admins_document_key";

ALTER TABLE "admins"
    DROP COLUMN IF EXISTS "deletedAt",
    DROP COLUMN IF EXISTS "document",
    DROP COLUMN IF EXISTS "password",
    DROP COLUMN IF EXISTS "role";

ALTER TABLE "teachers"
    DROP COLUMN IF EXISTS "deletedAt",
    DROP COLUMN IF EXISTS "document",
    DROP COLUMN IF EXISTS "password";

ALTER TABLE "students"
    DROP COLUMN IF EXISTS "deletedAt",
    DROP COLUMN IF EXISTS "document",
    DROP COLUMN IF EXISTS "password";

-- Remove enum antigo (idempotente)
DROP TYPE IF EXISTS "AdminRole";

-- Índices únicos nos userId (idempotente)
CREATE UNIQUE INDEX IF NOT EXISTS "admins_userId_key" ON "admins"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "teachers_userId_key" ON "teachers"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "students_userId_key" ON "students"("userId");

-- Foreign keys (idempotente via DO block)
DO $$ BEGIN
    ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
