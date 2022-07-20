import { Request, Response } from "express";
import { UpdateSchoolRepository } from "../../repositories/school/UpdateSchoolRepository";
import { UpdateSchoolService } from "../../services/school/UpdateSchoolService";

class UpdateSchoolController {
    async handle(request: Request, response: Response){
        const { id } = request.params;
        const { name, address, networkId } = request.body

        const updateSchoolService = new UpdateSchoolService(
            new UpdateSchoolRepository()
        )

        const schoolUpdate = await updateSchoolService.execute({id, name, address, networkId})

        return response.status(201).json(schoolUpdate);
    }
}

export { UpdateSchoolController }