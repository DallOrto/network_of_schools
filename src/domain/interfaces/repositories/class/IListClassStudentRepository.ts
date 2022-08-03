import {
  ListClassStudentFilter,
  ListClassStudentResponse
} from "../../../dtos/class/ListClassStudentDTO";

export interface IListClassStudentRepository {
  listClassStudent(
    filter: ListClassStudentFilter
  ): Promise<ListClassStudentResponse[]>;
}
