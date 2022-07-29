import { Request, Response } from "express";
import { ListStudentFilter } from "../../domain/dtos/student/ListStudentDTO";
import { ListStudentRepository } from "../../repositories/student/ListStudentRepository";
import { ListStudentService } from "../../services/student/ListStudentService";

class ListStudentController {
    async handle(request:Request, response:Response) {
        const { schoolId }: ListStudentFilter = request.query;

        const listStudentService = new ListStudentService(
            new ListStudentRepository()
        )

        const students = await listStudentService.execute({ schoolId });

        return response.status(201).json(students);
    }
}

export { ListStudentController }