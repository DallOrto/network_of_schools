import { Request, Response } from "express";
import { CreateStudentRequest } from "../../domain/dtos/student/StudentDTO";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { CreateStudentService } from "../../services/student/CreateStudentService";

class CreateStudentController {
    async handle(request: Request, response: Response) {
        const { name, document, password, birthDate, schoolId }: CreateStudentRequest = request.body;

        const createStudentService = new CreateStudentService(
            new StudentRepository()
        );

        const student = await createStudentService.execute({ name, document, password, birthDate, schoolId });

        return response.status(201).json(student);
    }
}

export { CreateStudentController };