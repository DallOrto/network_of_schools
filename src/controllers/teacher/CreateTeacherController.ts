import { Request, Response } from "express";
import { CreateTeacherRequest } from "../../domain/dtos/teacher/TeacherDTO";
import { TeacherRepository } from "../../repositories/teacher/TeacherRepository";
import { CreateTeacherService } from "../../services/teacher/CreateTeacherService";

class CreateTeacherController {
    async handle(request: Request, response: Response) {
        const { name, document, password, birthDate, schoolId }:CreateTeacherRequest = request.body;

        const createTeacherService = new CreateTeacherService(
            new TeacherRepository()
        );

        const teacher = await createTeacherService.execute({ name, document, password, birthDate, schoolId });

        return response.status(201).json(teacher);
    }
}

export { CreateTeacherController }