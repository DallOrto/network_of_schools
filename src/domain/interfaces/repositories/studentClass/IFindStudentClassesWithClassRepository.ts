import { Class } from "@prisma/client";

interface StudentClassWithClass {
  id: string;
  studentId: string;
  classId: string;
  class: Class;
}

interface IFindStudentClassesWithClassRepository {
  findByStudentIdWithClass(studentId: string): Promise<StudentClassWithClass[]>;
}

export { IFindStudentClassesWithClassRepository, StudentClassWithClass };