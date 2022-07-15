import { Request, Response } from "express";
import { ListSchoolsService } from "../../services/school/ListSchoolsService";

class ListSchoolsController {
    async handle(request: Request, response: Response) {
        
        const listSchoolsService = new ListSchoolsService();

        const allSchools = await listSchoolsService

        const student = await listSchoolsService.execute({});

        

        
        return response.status(201).json(allSchools);
    }
}


export { ListSchoolsController }




