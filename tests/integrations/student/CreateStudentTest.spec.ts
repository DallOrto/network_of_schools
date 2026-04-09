import nock from "nock";
import { faker } from "@faker-js/faker";
import { PrismaClient } from ".prisma/client";
import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

const prisma = new PrismaClient();

const complianceApiUrl = process.env.COMPLIANCE_API_URL || "https://compliance-student.onrender.com";
const complianceApiOrigin = new URL(complianceApiUrl).origin;

const defaultComplianceReply = {
  complianceId: "test-compliance-id",
  approved: true,
  reason: null,
  student: {
    id: "test-compliance-student-id",
    name: "Test Student",
    document: "00000000",
    schoolId: "test-school-id",
  },
};

afterEach(() => {
  nock.cleanAll();
  nock(complianceApiOrigin)
    .post("/students/compliance")
    .reply(200, defaultComplianceReply)
    .persist();
});

describe("Create Student Controller", () => {
  it("should be able to create a Student", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(201);
    expect(studentResponse.body.error).toBeFalsy();
  });

  it("should create an APPROVED enrollment attempt when student is created", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(201);

    const attempt = await prisma.enrollmentAttempt.findFirst({
      where: { studentDocument: studentRequestBody.document },
    });

    expect(attempt).not.toBeNull();
    expect(attempt!.status).toBe("APPROVED");
    expect(attempt!.complianceId).toBe("test-compliance-id");
    expect(attempt!.complianceStudentId).toBe("test-compliance-student-id");
    expect(attempt!.studentId).toBe(studentResponse.body.id);
    expect(attempt!.rejectionReason).toBeNull();
  });

  it("should create a REJECTED enrollment attempt when compliance rejects", async () => {
    nock.cleanAll();
    nock(complianceApiOrigin)
      .post("/students/compliance")
      .once()
      .reply(200, {
        complianceId: "test-compliance-id-rejected",
        approved: false,
        reason: "B",
        student: {
          id: "test-compliance-student-id-rejected",
          name: "Rejected Student",
          document: "99999999",
          schoolId: "test-school-id",
        },
      });
    nock(complianceApiOrigin)
      .post("/students/compliance")
      .reply(200, defaultComplianceReply)
      .persist();

    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(422);

    const attempt = await prisma.enrollmentAttempt.findFirst({
      where: { studentDocument: studentRequestBody.document },
    });

    expect(attempt).not.toBeNull();
    expect(attempt!.status).toBe("REJECTED");
    expect(attempt!.complianceId).toBe("test-compliance-id-rejected");
    expect(attempt!.complianceStudentId).toBe("test-compliance-student-id-rejected");
    expect(attempt!.studentId).toBeNull();
    expect(attempt!.rejectionReason).toBe("B");
  });

  it("should not be able to create a Student with invalid schoolId", async () => {
    const studentRequestBody = {
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(400);
    expect(studentResponse.body).toHaveProperty("message");
  });
});
