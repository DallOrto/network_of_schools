import { Request, Response } from "express";
import { CreateStudentRequest } from "../../domain/dtos/student/StudentDTO";
import { CreateSchoolRepository } from "../../repositories/school/CreateSchoolRepository";
import { StudentRepository } from "../../repositories/student/StudentRepository";
import { AuditLogRepository } from "../../repositories/auditLog/AuditLogRepository";
import { ComplianceService } from "../../services/compliance/ComplianceService";
import { CreateStudentService } from "../../services/student/CreateStudentService";
import { AuditLogService } from "../../services/auditLog/AuditLogService";
import { EnrollmentAttemptRepository } from "../../repositories/enrollmentAttempt/EnrollmentAttemptRepository";

class CreateStudentController {
  async handle(request: Request, response: Response) {
    const { name, document, password, birthDate, schoolId }: CreateStudentRequest = request.body;

    const createStudentService = new CreateStudentService(
      new StudentRepository(),
      new CreateSchoolRepository(),
      new ComplianceService(),
      new EnrollmentAttemptRepository()
    );

    const student = await createStudentService.execute({ name, document, password, birthDate, schoolId });

    await new AuditLogService(new AuditLogRepository()).log({
      actorId: request.user!.id,
      actorRole: request.user!.role,
      action: "CREATE",
      entity: "STUDENT",
      entityId: student.id,
      metadata: { name: student.name, schoolId },
    });

    return response.status(201).json(student);
  }
}

export { CreateStudentController };
