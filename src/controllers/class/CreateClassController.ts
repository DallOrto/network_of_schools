import { Request, Response } from "express";
import { CreateClassRequest } from "../../domain/dtos/class/ClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { CreateClassService } from "../../services/class/CreateClassService";

class CreateClassController {
  async handle(request: Request, response: Response) {
    const { name, classDay, startTime, endTime, schoolId, maxStudents: maxStudentsRaw } = request.body;
    const maxStudents = Number(maxStudentsRaw);

    const createClassService = new CreateClassService(
      new ClassRepository(),
      new CreateSchoolRepository()
    );

    const classRegister = await createClassService.execute({
      name,
      classDay,
      startTime,
      endTime,
      schoolId,
      maxStudents
    });

    return response.status(201).json(classRegister);
  }
}

export { CreateClassController };
