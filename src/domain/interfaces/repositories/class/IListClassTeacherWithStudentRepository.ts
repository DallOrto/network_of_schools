import {
  ListClassTeacherWithStudentFilter,
  ListClassTeacherWithStudentResponse
} from "../../../dtos/class/ListClassTeacherWithStudentDTO";

export interface IListClassTeacherWithStudentRepository {
  listClassTeacherWithStudent(
    filter: ListClassTeacherWithStudentFilter
  ): Promise<ListClassTeacherWithStudentResponse[]>;
}
