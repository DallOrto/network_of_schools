import { Request, Response } from "express";
import { ListClassTeacherWithStudentFilter } from "../../domain/dtos/class/ListClassTeacherWithStudentDTO";
import { ListClassTeacherWithStudentRepository } from "../../repositories/class/ListClassTeacherWithStudentRepository";
import { ListClassTeacherWithStudentService } from "../../services/class/ListClassTeacherWithStudentService";

class ListClassTeacherWithStudentController {
  async handle(request: Request, response: Response) {
    const { teacherId }: ListClassTeacherWithStudentFilter = request.query;

    const listClassTeacherWithStudentService =
      new ListClassTeacherWithStudentService(
        new ListClassTeacherWithStudentRepository()
      );

    const listClassTeacher = await listClassTeacherWithStudentService.execute({
      teacherId
    });

    return response.status(201).json(listClassTeacher);
  }
}

export { ListClassTeacherWithStudentController };
