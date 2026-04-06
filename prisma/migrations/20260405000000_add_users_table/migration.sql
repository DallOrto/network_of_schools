-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'network_admin', 'school_admin', 'teacher', 'student');

-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_document_key" ON "users"("document");

-- Adiciona userId como nullable para poder popular antes de tornar obrigatório
ALTER TABLE "admins" ADD COLUMN "userId" TEXT;
ALTER TABLE "teachers" ADD COLUMN "userId" TEXT;
ALTER TABLE "students" ADD COLUMN "userId" TEXT;

-- Migra admins existentes: cria registro em users e vincula
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "document", "password", "role"::text::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "admins";

UPDATE "admins" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "admins"."document"
);

-- Migra teachers existentes: cria registro em users e vincula
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "document", "password", 'teacher'::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "teachers";

UPDATE "teachers" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "teachers"."document"
);

-- Migra students existentes: cria registro em users e vincula
INSERT INTO "users" ("id", "document", "password", "role", "deletedAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "document", "password", 'student'::"UserRole", "deletedAt", "createdAt", "updatedAt"
FROM "students";

UPDATE "students" SET "userId" = (
    SELECT "id" FROM "users" WHERE "users"."document" = "students"."document"
);

-- Torna userId obrigatório agora que todos os registros foram populados
ALTER TABLE "admins" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "teachers" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "students" ALTER COLUMN "userId" SET NOT NULL;

-- Remove colunas de identidade das tabelas de perfil
DROP INDEX "admins_document_key";

ALTER TABLE "admins"
    DROP COLUMN "deletedAt",
    DROP COLUMN "document",
    DROP COLUMN "password",
    DROP COLUMN "role";

ALTER TABLE "teachers"
    DROP COLUMN "deletedAt",
    DROP COLUMN "document",
    DROP COLUMN "password";

ALTER TABLE "students"
    DROP COLUMN "deletedAt",
    DROP COLUMN "document",
    DROP COLUMN "password";

-- Remove enum antigo
DROP TYPE "AdminRole";

-- Índices únicos nos userId
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- Foreign keys
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
