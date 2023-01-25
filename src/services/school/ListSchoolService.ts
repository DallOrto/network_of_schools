import {
  ListSchoolFilter,
  ListSchoolResponse
} from "../../domain/dtos/school/ListSchoolDTO";
import { IListSchoolRepository } from "../../domain/interfaces/repositories/school/IListSchoolRepository";

class ListSchoolService {
  private listSchoolRepository: IListSchoolRepository;

  constructor(listSchoolRepository: IListSchoolRepository) {
    this.listSchoolRepository = listSchoolRepository;
  }

  async execute(filter: ListSchoolFilter): Promise<ListSchoolResponse[]> {
    return this.listSchoolRepository.listSchools(filter);
  }
}

export { ListSchoolService };
