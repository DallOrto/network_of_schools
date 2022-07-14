import { Request, Response } from "express";
import { ICreateSchoolDTO } from "../../dtos/ICreateSchoolDTO";
import { CreateSchoolService } from "../../services/school/CreateSchoolService";

class CreateSchoolController {
    async handle(request: Request, response: Response) {
        const { name, address, networkId }: ICreateSchoolDTO = request.body;

        const createSchoolService = new CreateSchoolService();  
        
        const school = await createSchoolService.execute({ name, address, networkId });

        return response.status(201).json(school);
    }
}

export { CreateSchoolController }