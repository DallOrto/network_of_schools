import { Request, Response } from "express";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { DeleteStudentService } from "../../services/student/DeleteStudentService";

class DeleteStudentController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteStudentService = new DeleteStudentService(
      new StudentRepository()
    );

    await deleteStudentService.execute(id);

    return response.status(204).send();
  }
}

export { DeleteStudentController };
