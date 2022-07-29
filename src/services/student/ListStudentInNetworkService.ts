import { ListStudentInNetworkFilter, ListStudentInNetworkResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentInNetworkRepository } from "../../domain/interfaces/repositories/student/IListStudentInNetworkRepository";

class ListStudentInNetworkService {
    private listStudentInNetworkRepository : IListStudentInNetworkRepository;

    constructor(
        listStudentInNetworkRepository : IListStudentInNetworkRepository
    ) {
        this.listStudentInNetworkRepository = listStudentInNetworkRepository
    }

    async execute(filter: ListStudentInNetworkFilter): Promise<ListStudentInNetworkResponse[]> {
        return this.listStudentInNetworkRepository.listStudentInNetwork( filter );
    }
}

export { ListStudentInNetworkService }