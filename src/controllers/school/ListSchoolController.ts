import { Request, Response } from "express";
import { ListSchoolFilter } from "../../domain/dtos/school/ListSchoolDTO";
import { ListSchoolRepository } from "../../repositories/school/ListSchoolRepository";
import { ListSchoolService } from "../../services/school/ListSchoolService";

class ListSchoolController {
    async handle(request: Request, response: Response) {
        const { networkId }: ListSchoolFilter = request.query;

        const listschoolService = new ListSchoolService(
            new ListSchoolRepository()
        );

        const schools = await listschoolService.execute({ networkId })

        return response.status(201).json(schools);
    }
}

export { ListSchoolController }




