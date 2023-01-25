/*
  Warnings:

  - You are about to drop the column `time` on the `classes` table. All the data in the column will be lost.
  - Added the required column `EndTime` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StartTime` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "time",
ADD COLUMN     "EndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "StartTime" TIMESTAMP(3) NOT NULL;
