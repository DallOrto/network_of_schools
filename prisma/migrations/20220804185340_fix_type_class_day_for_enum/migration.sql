/*
  Warnings:

  - Changed the type of `classDay` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "classDay",
ADD COLUMN     "classDay" "WeekDays" NOT NULL;
