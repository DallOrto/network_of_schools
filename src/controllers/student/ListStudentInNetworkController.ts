import { Request, Response } from "express";
import { ListStudentInNetworkFilter } from "../../domain/dtos/student/ListStudentDTO";
import { ListStudentInNetworkRepository } from "../../repositories/student/ListStudentInNetworkRepository";
import { ListStudentInNetworkService } from "../../services/student/ListStudentInNetworkService";

class ListStudentInNetworkController {
    async handle(request:Request, response:Response) {
        const { networkId }: ListStudentInNetworkFilter = request.query;

        const listStudentInNetworkService = new ListStudentInNetworkService(
            new ListStudentInNetworkRepository()
        )

        const studentsInNetwork = await listStudentInNetworkService.execute({ networkId })

        return response.status(201).json(studentsInNetwork);
    }
}

export { ListStudentInNetworkController }