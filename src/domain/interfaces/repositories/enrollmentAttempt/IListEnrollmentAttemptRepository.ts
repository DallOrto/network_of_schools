import { ListEnrollmentAttemptResponse } from "../../../dtos/enrollmentAttempt/ListEnrollmentAttemptDTO";

interface IListEnrollmentAttemptRepository {
    findByDocument(document: string): Promise<ListEnrollmentAttemptResponse[]>;
}

export { IListEnrollmentAttemptRepository };
