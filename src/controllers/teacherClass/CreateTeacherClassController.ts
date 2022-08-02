import { Request, Response } from "express";
import { CreateTeacherClassRequest } from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { TeacherRepository } from "../../repositories/teacher/TeacherRepository";
import { TeacherClassRepository } from "../../repositories/teacherClass/TeacherClassRepository";
import { CreateTeacherClassService } from "../../services/teacherClass/CreateTeacherClassService";

class CreateTeacherClassController {
  async handle(request: Request, response: Response) {
    const { teacherId, classId }: CreateTeacherClassRequest = request.body;

    const createTeacherClassService = new CreateTeacherClassService(
      new TeacherClassRepository(),
      new TeacherRepository(),
      new ClassRepository()
    );

    await createTeacherClassService.execute({ teacherId, classId });

    return response.status(201).send();
  }
}

export { CreateTeacherClassController };
