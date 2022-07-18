/*
  Warnings:

  - You are about to drop the column `class_day` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `networks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `networks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `network_id` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `teachers` table. All the data in the column will be lost.
  - Added the required column `classDay` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `networkId` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "class_day",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "classDay" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "networks" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "created_at",
DROP COLUMN "network_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "networkId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "birth_date",
DROP COLUMN "created_at",
DROP COLUMN "school_id",
DROP COLUMN "updated_at",
ADD COLUMN     "birthDate" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "schoolId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "birth_date",
DROP COLUMN "created_at",
DROP COLUMN "school_id",
DROP COLUMN "updated_at",
ADD COLUMN     "birthDate" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "schoolId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "StudentsClasses" (
    "id" TEXT NOT NULL,
    "studentdId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "StudentsClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachersClasses" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "TeachersClasses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentsClasses" ADD CONSTRAINT "StudentsClasses_studentdId_fkey" FOREIGN KEY ("studentdId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentsClasses" ADD CONSTRAINT "StudentsClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachersClasses" ADD CONSTRAINT "TeachersClasses_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachersClasses" ADD CONSTRAINT "TeachersClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
