import { ListTeacherFilter, ListTeacherResponse } from "../../../dtos/teacher/ListTeacherDTO";

export interface IListTeacherRepository {
    listTeacher(filter: ListTeacherFilter ): Promise<ListTeacherResponse[]>
}