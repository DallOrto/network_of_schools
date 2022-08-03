import { ListStudentFilter, ListStudentResponse } from "../../domain/dtos/student/ListStudentDTO";
import { IListStudentRepository } from "../../domain/interfaces/repositories/student/IListStudentRepository";

class ListStudentService {
    private listStudentRepository: IListStudentRepository;

    constructor(
        listStudentRepository: IListStudentRepository
    ) {
        this.listStudentRepository = listStudentRepository
    }

    async execute(filter: ListStudentFilter):Promise<ListStudentResponse[]>{
        return this.listStudentRepository.listStudent( filter )
    }
}

export { ListStudentService }