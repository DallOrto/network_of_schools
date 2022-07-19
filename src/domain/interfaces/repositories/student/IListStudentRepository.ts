import { ListStudentFilter, ListStudentResponse } from "../../../dtos/student/ListStudentDTO";

export interface IListStudentRepository {
    listStudent(filter: ListStudentFilter):Promise<ListStudentResponse[]>
}