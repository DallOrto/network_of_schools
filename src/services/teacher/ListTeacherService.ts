import { ListTeacherFilter, ListTeacherResponse } from "../../domain/dtos/teacher/ListTeacherDTO";
import { IListTeacherRepository } from "../../domain/interfaces/repositories/teacher/IListTeacherRepository";

class ListTeacherService {
    private listTeacherRepository: IListTeacherRepository;

    constructor(
        listTeacherRepository: IListTeacherRepository
    ) {
        this.listTeacherRepository = listTeacherRepository
    }

    async execute(filter: ListTeacherFilter): Promise<ListTeacherResponse[]>{
        return this.listTeacherRepository.listTeacher( filter );
    }
}

export { ListTeacherService }
