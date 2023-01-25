import {
  ListClassStudentFilter,
  ListClassStudentResponse
} from "../../domain/dtos/class/ListClassStudentDTO";
import { IListClassStudentRepository } from "../../domain/interfaces/repositories/class/IListClassStudentRepository";

class ListClassStudentService {
  private listClassStudentRepository: IListClassStudentRepository;

  constructor(listClassStudentRepository: IListClassStudentRepository) {
    this.listClassStudentRepository = listClassStudentRepository;
  }

  async execute(
    filter: ListClassStudentFilter
  ): Promise<ListClassStudentResponse[]> {
    return this.listClassStudentRepository.listClassStudent(filter);
  }
}

export { ListClassStudentService };
