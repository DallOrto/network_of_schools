import { Request, Response } from "express";
import { ListTeacherFilter } from "../../domain/dtos/teacher/ListTeacherDTO";
import { ListTeacherRepository } from "../../repositories/teacher/ListTeacherRepository";
import { ListTeacherService } from "../../services/teacher/ListTeacherService";

class ListTeacherController {
    async handle(request: Request, response: Response) {
        const { schoolId }: ListTeacherFilter = request.query;

        const listTeacherService = new ListTeacherService(
            new ListTeacherRepository()
        )

        const teachers = await listTeacherService.execute({ schoolId });

        return response.status(201).json(teachers);
    }
}

export { ListTeacherController }