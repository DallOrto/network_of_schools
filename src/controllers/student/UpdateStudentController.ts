import { Request, Response } from "express";
import { UpdateStudentRepository } from "../../repositories/student/UpdateStudentRepository";
import { UpdateStudentService } from "../../services/student/UpdateStudentService";

class UpdateStudentController {
    async handle(request: Request, response: Response){
        const { id } = request.params;
        const { name, document, password, birthDate ,schoolId } = request.body

        const updateStudentService = new UpdateStudentService(
            new UpdateStudentRepository()
        )

        const studentUpdate = await updateStudentService.execute({id, name, document, password, birthDate ,schoolId})

        return response.status(201).json(studentUpdate);
    }
}

export { UpdateStudentController }