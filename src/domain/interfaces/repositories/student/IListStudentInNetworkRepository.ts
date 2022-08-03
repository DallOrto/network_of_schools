import {
  ListStudentInNetworkFilter,
  ListStudentInNetworkResponse
} from "../../../dtos/student/ListStudentDTO";

interface IListStudentInNetworkRepository {
  listStudentInNetwork(
    filter: ListStudentInNetworkFilter
  ): Promise<ListStudentInNetworkResponse[]>;
}

export { IListStudentInNetworkRepository };
