import nock from "nock";
import { faker } from "@faker-js/faker";
import { PrismaClient } from ".prisma/client";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest, mockIStudentRequest } from "../../helpers/mock";
import { superAppRequest, internalRequest } from "../../setup";

const prisma = new PrismaClient();

const complianceApiUrl = process.env.COMPLIANCE_API_URL || "https://compliance-student.onrender.com";
const complianceApiOrigin = new URL(complianceApiUrl).origin;

const defaultComplianceReply = {
  jobId: "test-job-id",
  status: "PROCESSING",
};

afterEach(() => {
  nock.cleanAll();
  nock(complianceApiOrigin)
    .post("/students/compliance")
    .reply(202, defaultComplianceReply)
    .persist();
});

// Payload que a API 2 envia via webhook quando aprova
const approvedCallbackPayload = {
  jobId: "test-job-id",
  complianceId: "test-compliance-id",
  approved: true,
  reason: null,
  complianceStudentId: "test-compliance-student-id",
};

// Payload que a API 2 envia via webhook quando rejeita
const rejectedCallbackPayload = {
  jobId: "test-job-id",
  complianceId: "test-compliance-id-rejected",
  approved: false,
  reason: "Documentação inválida",
  complianceStudentId: "test-compliance-student-id",
};

describe("Create Student Controller", () => {
  it("should return 202 with enrollmentAttemptId and PROCESSING status", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));

    const response = await superAppRequest
      .post("/students")
      .send(mockIStudentRequest(school.id));

    expect(response.status).toBe(202);
    expect(response.body).toMatchObject({ status: "PROCESSING" });
    expect(response.body.enrollmentAttemptId).toBeDefined();
  });

  it("should create enrollment attempt with PROCESSING status immediately", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    const response = await superAppRequest.post("/students").send(studentBody);

    expect(response.status).toBe(202);

    const attempt = await prisma.enrollmentAttempt.findUnique({
      where: { id: response.body.enrollmentAttemptId },
    });

    expect(attempt).not.toBeNull();
    expect(attempt!.status).toBe("PROCESSING");
    expect(attempt!.studentDocument).toBe(studentBody.document);
    expect(attempt!.complianceJobId).toBe("test-job-id");
  });

  it("should create student and set attempt to APPROVED after callback", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    // 1. Cria o attempt (PROCESSING)
    const createResponse = await superAppRequest.post("/students").send(studentBody);
    expect(createResponse.status).toBe(202);

    const attemptId = createResponse.body.enrollmentAttemptId;

    // 2. Simula o webhook da API 2 aprovando
    const callbackResponse = await internalRequest
      .post(`/internal/compliance-result/${attemptId}`)
      .send(approvedCallbackPayload);

    expect(callbackResponse.status).toBe(200);

    // 3. Verifica que o attempt foi atualizado
    const attempt = await prisma.enrollmentAttempt.findUnique({ where: { id: attemptId } });
    expect(attempt!.status).toBe("APPROVED");
    expect(attempt!.complianceId).toBe("test-compliance-id");
    expect(attempt!.complianceStudentId).toBe("test-compliance-student-id");
    expect(attempt!.studentId).not.toBeNull();
    expect(attempt!.rejectionReason).toBeNull();

    // 4. Verifica que o aluno foi criado no banco
    const student = await prisma.student.findFirst({
      where: { id: attempt!.studentId! },
    });
    expect(student).not.toBeNull();
    expect(student!.schoolId).toBe(school.id);
  });

  it("should set attempt to REJECTED after callback with rejection", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    // 1. Cria o attempt (PROCESSING)
    const createResponse = await superAppRequest.post("/students").send(studentBody);
    expect(createResponse.status).toBe(202);

    const attemptId = createResponse.body.enrollmentAttemptId;

    // 2. Simula o webhook da API 2 rejeitando
    const callbackResponse = await internalRequest
      .post(`/internal/compliance-result/${attemptId}`)
      .send(rejectedCallbackPayload);

    expect(callbackResponse.status).toBe(200);

    // 3. Verifica o attempt
    const attempt = await prisma.enrollmentAttempt.findUnique({ where: { id: attemptId } });
    expect(attempt!.status).toBe("REJECTED");
    expect(attempt!.rejectionReason).toBe("Documentação inválida");
    expect(attempt!.studentId).toBeNull();

    // 4. Verifica que nenhum aluno foi criado
    const student = await prisma.student.findFirst({
      where: { schoolId: school.id, user: { document: studentBody.document } },
      include: { user: true },
    });
    expect(student).toBeNull();
  });

  it("should return 401 on callback without api key", async () => {
    const response = await superAppRequest
      .post("/internal/compliance-result/any-id")
      .send(approvedCallbackPayload);

    // superAppRequest usa JWT, não x-api-key — deve ser 401
    expect(response.status).toBe(401);
  });

  it("should not be able to create a Student with invalid schoolId", async () => {
    const response = await superAppRequest.post("/students").send({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
