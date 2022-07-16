import { Request, Response } from "express";
import { CreateSchoolRequest } from "../../domain/dtos/school/SchoolDTO";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { CreateSchoolService } from "../../services/school/CreateSchoolService";

class CreateSchoolController {
    async handle(request: Request, response: Response) {
        const { name, address, networkId }: CreateSchoolRequest = request.body;

        const createSchoolService = new CreateSchoolService(
            new CreateSchoolRepository()
        );

        const school = await createSchoolService.execute({ name, address, networkId });

        return response.status(201).json(school);
    }
}

export { CreateSchoolController }