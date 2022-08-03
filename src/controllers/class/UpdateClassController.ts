import { Request, Response } from "express";
import { UpdateClassRepository } from "../../repositories/class/UpdateClassRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { UpdateClassService } from "../../services/class/UpdateClassService";

class UpdateClassController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, classDay, time, schoolId } = request.body;

    const updateClassService = new UpdateClassService(
      new UpdateClassRepository(),
      new CreateSchoolRepository()
    );

    const classUpdate = await updateClassService.execute({
      id,
      name,
      classDay,
      time,
      schoolId
    });

    return response.status(201).json(classUpdate);
  }
}

export { UpdateClassController };
