import { Request, Response } from "express";
import { UpdateClassRepository } from "../../repositories/class/UpdateClassRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { UpdateClassService } from "../../services/class/UpdateClassService";

class UpdateClassController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, classDay, startTime, endTime, schoolId, maxStudents: maxStudentsRaw } = request.body;
    const maxStudents = Number(maxStudentsRaw);

    const updateClassService = new UpdateClassService(
      new UpdateClassRepository(),
      new CreateSchoolRepository()
    );

    const classUpdate = await updateClassService.execute({
      id,
      name,
      classDay,
      startTime,
      endTime,
      schoolId,
      maxStudents
    });

    return response.status(201).json(classUpdate);
  }
}

export { UpdateClassController };
