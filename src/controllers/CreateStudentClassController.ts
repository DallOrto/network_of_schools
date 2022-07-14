import { Request, Response } from "express";
import { CreateStudentClassService } from "../services/CreateStudentClassService";

class CreateStudentClassController {
    async handle(request: Request, response: Response) {
        const { studentId, classId } = request.body;

        const createStudentClassService = new CreateStudentClassService();

        await createStudentClassService.execute({ studentId, classId });

        return response.status(201).send();
    }
}

export { CreateStudentClassController }