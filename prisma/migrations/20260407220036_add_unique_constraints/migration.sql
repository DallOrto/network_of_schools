/*
  Warnings:

  - A unique constraint covering the columns `[studentId,classId]` on the table `StudentsClasses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId,classId]` on the table `TeachersClasses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,classDay,startTime,endTime]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentsClasses_studentId_classId_key" ON "StudentsClasses"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "TeachersClasses_teacherId_classId_key" ON "TeachersClasses"("teacherId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_classDay_startTime_endTime_key" ON "classes"("name", "classDay", "startTime", "endTime");
