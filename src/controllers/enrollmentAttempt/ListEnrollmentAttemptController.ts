import { Request, Response } from "express";
import { EnrollmentAttemptRepository } from "../../repositories/enrollmentAttempt/EnrollmentAttemptRepository";
import { ListEnrollmentAttemptService } from "../../services/enrollmentAttempt/ListEnrollmentAttemptService";

class ListEnrollmentAttemptController {
    async handle(request: Request, response: Response) {
        const { document } = request.params;

        const listEnrollmentAttemptService = new ListEnrollmentAttemptService(
            new EnrollmentAttemptRepository()
        );

        const attempts = await listEnrollmentAttemptService.execute({ document });

        return response.status(200).json(attempts);
    }
}

export { ListEnrollmentAttemptController };
