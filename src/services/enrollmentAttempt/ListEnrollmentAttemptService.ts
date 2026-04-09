import { ListEnrollmentAttemptFilter, ListEnrollmentAttemptResponse } from "../../domain/dtos/enrollmentAttempt/ListEnrollmentAttemptDTO";
import { IListEnrollmentAttemptRepository } from "../../domain/interfaces/repositories/enrollmentAttempt/IListEnrollmentAttemptRepository";

class ListEnrollmentAttemptService {
    private enrollmentAttemptRepository: IListEnrollmentAttemptRepository;

    constructor(enrollmentAttemptRepository: IListEnrollmentAttemptRepository) {
        this.enrollmentAttemptRepository = enrollmentAttemptRepository;
    }

    async execute({ document }: ListEnrollmentAttemptFilter): Promise<ListEnrollmentAttemptResponse[]> {
        return this.enrollmentAttemptRepository.findByDocument(document);
    }
}

export { ListEnrollmentAttemptService };
