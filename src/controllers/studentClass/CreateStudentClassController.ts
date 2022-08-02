import { Request, Response } from "express";
import { CreateStudentClassRequest } from "../../domain/dtos/studentClass/StudentClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { StudentClassRepository } from "../../repositories/studentClass/StudentClassRepository";
import { CreateStudentClassService } from "../../services/studentClass/CreateStudentClassService";

class CreateStudentClassController {
  async handle(request: Request, response: Response) {
    const { studentId, classId }: CreateStudentClassRequest = request.body;

    const createStudentClassService = new CreateStudentClassService(
      new StudentClassRepository(),
      new StudentRepository(),
      new ClassRepository()
    );

    await createStudentClassService.execute({ studentId, classId });

    return response.status(201).send();
  }
}

export { CreateStudentClassController };
