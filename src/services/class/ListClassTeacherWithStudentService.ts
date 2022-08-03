import {
  ListClassTeacherWithStudentFilter,
  ListClassTeacherWithStudentResponse
} from "../../domain/dtos/class/ListClassTeacherWithStudentDTO";
import { IListClassTeacherWithStudentRepository } from "../../domain/interfaces/repositories/class/IListClassTeacherWithStudentRepository";

class ListClassTeacherWithStudentService {
  private listClassTeacherWithStudentRepository: IListClassTeacherWithStudentRepository;

  constructor(
    listClassTeacherWithStudentRepository: IListClassTeacherWithStudentRepository
  ) {
    this.listClassTeacherWithStudentRepository =
      listClassTeacherWithStudentRepository;
  }

  async execute(
    filter: ListClassTeacherWithStudentFilter
  ): Promise<ListClassTeacherWithStudentResponse[]> {
    return this.listClassTeacherWithStudentRepository.listClassTeacherWithStudent(
      filter
    );
  }
}

export { ListClassTeacherWithStudentService };
