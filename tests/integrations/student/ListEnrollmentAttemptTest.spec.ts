import nock from "nock";
import { unauthRequest, superAppRequest, teacherToken, studentToken } from "../../setup";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest, mockIStudentRequest } from "../../helpers/mock";

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

describe("List Enrollment Attempts Controller", () => {
  it("should return enrollment attempts for a student document", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    await superAppRequest.post("/students").send(studentRequestBody);

    const response = await superAppRequest.get(
      `/students/${studentRequestBody.document}/enrollment-attempts`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toMatchObject({
      status: "APPROVED",
      complianceId: "test-compliance-id",
      complianceStudentId: "test-compliance-student-id",
    });
  });

  it("should return empty array when document has no attempts", async () => {
    const response = await superAppRequest.get(
      `/students/document-inexistente/enrollment-attempts`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return attempts ordered by most recent first", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    // configura: 1ª chamada → rejected, demais → approved
    nock.cleanAll();
    nock(complianceApiOrigin)
      .post("/students/compliance")
      .once()
      .reply(200, {
        complianceId: "compliance-rejected",
        approved: false,
        reason: "A",
        student: {
          id: "cs-order-test",
          name: studentRequestBody.name,
          document: studentRequestBody.document,
          schoolId: schoolResponse.id,
        },
      });
    nock(complianceApiOrigin)
      .post("/students/compliance")
      .reply(200, defaultComplianceReply)
      .persist();

    // 1ª tentativa → reprovada
    await superAppRequest.post("/students").send(studentRequestBody);

    // 2ª tentativa → aprovada
    await superAppRequest.post("/students").send(studentRequestBody);

    const response = await superAppRequest.get(
      `/students/${studentRequestBody.document}/enrollment-attempts`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(new Date(response.body[0].attemptedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(response.body[1].attemptedAt).getTime()
    );
  });

  it("should return 403 for teacher role", async () => {
    const response = await unauthRequest
      .get("/students/any-document/enrollment-attempts")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(response.status).toBe(403);
  });

  it("should return 403 for student role", async () => {
    const response = await unauthRequest
      .get("/students/any-document/enrollment-attempts")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(403);
  });

  it("should return 401 when unauthenticated", async () => {
    const response = await unauthRequest.get(
      "/students/any-document/enrollment-attempts"
    );

    expect(response.status).toBe(401);
  });
});
