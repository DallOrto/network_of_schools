import { CreateEnrollmentAttemptRequest, CreateEnrollmentAttemptResponse } from "../../../dtos/enrollmentAttempt/EnrollmentAttemptDTO";

interface ICreateEnrollmentAttemptRepository {
    create(data: CreateEnrollmentAttemptRequest): Promise<CreateEnrollmentAttemptResponse>;
}

export { ICreateEnrollmentAttemptRepository };
