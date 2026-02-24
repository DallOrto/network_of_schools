import { Request, Response } from "express";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { DeleteClassService } from "../../services/class/DeleteClassService";

class DeleteClassController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteClassService = new DeleteClassService(
      new ClassRepository()
    );

    await deleteClassService.execute(id);

    return response.status(204).send();
  }
}

export { DeleteClassController };