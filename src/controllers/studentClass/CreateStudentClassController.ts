import { Request, Response } from "express";
import { CreateStudentClassRequest } from "../../domain/dtos/studentClass/StudentClassDTO";
import { StudentClassRepository } from "../../repositories/studentClass/StudentClassRepository";
import { CreateStudentClassService } from "../../services/studentClass/CreateStudentClassService";

class CreateStudentClassController {
    async handle(request: Request, response: Response) {
        const { studentId, classId }: CreateStudentClassRequest = request.body;

        const createStudentClassService = new CreateStudentClassService(
            new StudentClassRepository()
        );

        await createStudentClassService.execute({ studentId, classId });

        return response.status(201).send();
    }
}

export { CreateStudentClassController }