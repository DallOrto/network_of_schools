import { Request, Response } from "express";
import { ICreateClassDTO } from "../dtos/ICreateClassDTO";
import { CreateClassService } from "../services/CreateClassService";


class CreateClassController {
    async handle(request: Request, response: Response) {
        const { name, classDay, time, schoolId }: ICreateClassDTO = request.body;

        const createClassService = new CreateClassService();

        const classRegister = await createClassService.execute({ name, classDay, time, schoolId });

        return response.status(201).json(classRegister);
    }
}

export { CreateClassController }