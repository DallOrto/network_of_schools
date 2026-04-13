import {
  CreateClassRequest,
  CreateClassResponse
} from "../../src/domain/dtos/class/ClassDTO";
import {
  CreateNetworkRequest,
  CreateNetworkResponse
} from "../../src/domain/dtos/network/NetworkDTO";
import {
  CreateSchoolRequest,
  CreateSchoolResponse
} from "../../src/domain/dtos/school/SchoolDTO";
import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../src/domain/dtos/student/StudentDTO";
import {
  CreateStudentClassRequest,
  CreateStudentClassResponse
} from "../../src/domain/dtos/studentClass/StudentClassDTO";
import {
  CreateTeacherRequest,
  CreateTeacherResponse
} from "../../src/domain/dtos/teacher/TeacherDTO";
import {
  CreateTeacherClassRequest,
  CreateTeacherClassResponse
} from "../../src/domain/dtos/teacherClass/TeacherClassDTO";
import { CreateAdminRequest, CreateAdminResponse } from "../../src/domain/dtos/admin/AdminDTO";
import { PrismaClient } from ".prisma/client";
import { superAppRequest, internalRequest } from "../setup";

const prisma = new PrismaClient();

export async function createNetwork(body: CreateNetworkRequest) {
  const networkResponse = await superAppRequest.post("/networks").send(body);

  const createNetworkResponseBody =
    networkResponse.body as CreateNetworkResponse;

  return createNetworkResponseBody;
}

export async function createSchool(body: CreateSchoolRequest) {
  const schoolResponse = await superAppRequest.post("/schools").send(body);

  const createSchoolResponseBody = schoolResponse.body as CreateSchoolResponse;

  return createSchoolResponseBody;
}

export async function createTeacher(body: CreateTeacherRequest) {
  const teacherResponse = await superAppRequest.post("/teachers").send(body);

  const createTeacherResponseBody =
    teacherResponse.body as CreateTeacherResponse;

  return createTeacherResponseBody;
}

/**
 * Cria um aluno completando o fluxo assíncrono inteiro:
 * 1. POST /students → recebe enrollmentAttemptId (PROCESSING)
 * 2. POST /internal/compliance-result/:id → simula o webhook de aprovação
 * 3. Busca o aluno criado no banco e retorna
 */
export async function createStudent(body: CreateStudentRequest): Promise<CreateStudentResponse> {
  const pendingResponse = await superAppRequest.post("/students").send(body);
  const { enrollmentAttemptId } = pendingResponse.body;

  await internalRequest
    .post(`/internal/compliance-result/${enrollmentAttemptId}`)
    .send({
      jobId: "test-job-id",
      complianceId: "test-compliance-id",
      approved: true,
      reason: null,
      complianceStudentId: "test-compliance-student-id",
    });

  const attempt = await prisma.enrollmentAttempt.findUnique({
    where: { id: enrollmentAttemptId },
  });

  const student = await prisma.student.findUniqueOrThrow({
    where: { id: attempt!.studentId! },
    include: { user: true },
  });

  return {
    id: student.id,
    name: student.name,
    document: (student as any).user.document,
    birthDate: student.birthDate,
    schoolId: student.schoolId,
    deletedAt: (student as any).user.deletedAt,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  } as unknown as CreateStudentResponse;
}

export async function createClass(body: CreateClassRequest) {
  const classResponse = await superAppRequest.post("/classes").send(body);

  const createClassResponseBody = classResponse.body as CreateClassResponse;

  return createClassResponseBody;
}

export async function createStudentClass(body: CreateStudentClassRequest) {
  const studentClassResponse = await superAppRequest
    .post("/classes/student")
    .send(body);

  const createStudentClassResponseBody =
    studentClassResponse.body as CreateStudentClassResponse;

  return createStudentClassResponseBody;
}

export async function createTeacherClass(body: CreateTeacherClassRequest) {
  const teacherClassResponse = await superAppRequest
    .post("/classes/teacher")
    .send(body);

  const createTeacherClassResponseBody =
    teacherClassResponse.body as CreateTeacherClassResponse;

  return createTeacherClassResponseBody;
}

export async function createAdmin(body: CreateAdminRequest) {
  const adminResponse = await superAppRequest.post("/admins").send(body);
  return adminResponse.body as CreateAdminResponse;
}
