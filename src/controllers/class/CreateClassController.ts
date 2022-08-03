import { Request, Response } from "express";
import { CreateClassRequest } from "../../domain/dtos/class/ClassDTO";
import { ClassRepository } from "../../repositories/class/ClassRepository";
import { CreateClassService } from "../../services/class/CreateClassService";

class CreateClassController {
    async handle(request: Request, response: Response) {
        const { name, classDay, time, schoolId }: CreateClassRequest = request.body;

        const createClassService = new CreateClassService(
            new ClassRepository()
        );

        const classRegister = await createClassService.execute({ name, classDay, time, schoolId });

        return response.status(201).json(classRegister);
    }
}

export { CreateClassController }