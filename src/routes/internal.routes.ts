import { Router } from "express";
import { apiKeyMiddleware } from "../middlewares/apiKeyMiddleware";
import { EnrollmentAttemptRepository } from "../repositories/enrollmentAttempt/EnrollmentAttemptRepository";
import { StudentRepository } from "../repositories/student/StudentRepository";
import { ProcessComplianceCallbackService } from "../services/compliance/ProcessComplianceCallbackService";
import { ComplianceCallbackController } from "../controllers/compliance/ComplianceCallbackController";

const enrollmentAttemptRepository = new EnrollmentAttemptRepository();
const studentRepository = new StudentRepository();
const processComplianceCallbackService = new ProcessComplianceCallbackService(
  enrollmentAttemptRepository,
  studentRepository,
);
const complianceCallbackController = new ComplianceCallbackController(
  processComplianceCallbackService,
);

const internalRoutes = Router();

// Protegido pela mesma INTERNAL_API_KEY usada entre as APIs
internalRoutes.post(
  "/compliance-result/:attemptId",
  apiKeyMiddleware,
  complianceCallbackController.handle,
);

export { internalRoutes };
