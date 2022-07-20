import { Request, Response } from "express";
import { UpdateTeacherRepository } from "../../repositories/teacher/UpdateTeacherRepository";
import { UpdateTeacherService } from "../../services/teacher/UpdateTeacherService";

class UpdateTeacherController {
    async handle(request: Request, response: Response){
        const { id } = request.params;
        const { name, document, password, birthDate ,schoolId } = request.body

        const updateTeacherService = new UpdateTeacherService(
            new UpdateTeacherRepository()
        )

        const teacherUpdate = await updateTeacherService.execute({id, name, document, password, birthDate ,schoolId})

        return response.status(201).json(teacherUpdate);
    }
}

export { UpdateTeacherController }