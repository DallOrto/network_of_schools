/*
  Warnings:

  - You are about to drop the column `studentdId` on the `StudentsClasses` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `StudentsClasses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentsClasses" DROP CONSTRAINT "StudentsClasses_studentdId_fkey";

-- AlterTable
ALTER TABLE "StudentsClasses" DROP COLUMN "studentdId",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentsClasses" ADD CONSTRAINT "StudentsClasses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
