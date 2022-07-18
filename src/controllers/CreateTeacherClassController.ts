import { Request, Response } from "express";
import { CreateTeacherClassService } from "../services/CreateTeacherClassService";

class CreateTeacherClassController {
    async handle(request: Request, response: Response) {
        const { teacherId, classId } = request.body;

        const createTeacherClassService = new CreateTeacherClassService();

        await createTeacherClassService.execute({ teacherId, classId });

        return response.status(201).send();
    }
}

export { CreateTeacherClassController }