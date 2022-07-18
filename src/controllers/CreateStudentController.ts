import { Request, Response } from "express";
import { ICreateStudentDTO } from "../dtos/ICreateStudentDTO";
import { CreateStudentService } from "../services/CreateStudentService";


class CreateStudentController {
    async handle(request: Request, response: Response) {
        const { name, document, password, birthDate, schoolId }: ICreateStudentDTO = request.body;

        const createStudentService = new CreateStudentService();

        const student = await createStudentService.execute({ name, document, password, birthDate, schoolId });

        return response.status(201).json(student);

    }
}

export { CreateStudentController };