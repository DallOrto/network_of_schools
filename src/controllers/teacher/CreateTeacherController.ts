import { Request, Response } from "express";
import { ICreateTeacherDTO } from "../../dtos/ICreateTeacherDTO";
import { CreateTeacherService } from "../../services/teacher/CreateTeacherService";

class CreateTeacherController {
    async handle(request: Request, response: Response) {
        const { name, document, password, birthDate, schoolId }:ICreateTeacherDTO = request.body;

        const createTeacherService = new CreateTeacherService();

        const teacher = await createTeacherService.execute(
            {
                name, 
                document, 
                password, 
                birthDate, 
                schoolId
            }
        );

        return response.status(201).json(teacher);

    }
}

export { CreateTeacherController } 