import { Request, Response } from "express";
import { ListClassStudentFilter } from "../../domain/dtos/class/ListClassStudentDTO";
import { ListClassStudentRepository } from "../../repositories/class/ListClassStudentRepository";
import { ListClassStudentService } from "../../services/class/ListClassStudentService";

class ListClassStudentController {
  async handle(request: Request, response: Response) {
    const { studentId }: ListClassStudentFilter = request.query;

    const listClassStudentService = new ListClassStudentService(
      new ListClassStudentRepository()
    );

    const listClassStudent = await listClassStudentService.execute({
      studentId
    });

    return response.status(201).json(listClassStudent);
  }
}

export { ListClassStudentController };
