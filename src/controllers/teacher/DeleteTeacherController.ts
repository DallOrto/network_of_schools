import { Request, Response } from "express";
import { TeacherRepository } from "../../repositories/teacher/TeacherRepository";
import { DeleteTeacherService } from "../../services/teacher/DeleteTeacherService";

class DeleteTeacherController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteTeacherService = new DeleteTeacherService(
      new TeacherRepository()
    );

    await deleteTeacherService.execute(id);

    return response.status(204).send();
  }
}

export { DeleteTeacherController };
