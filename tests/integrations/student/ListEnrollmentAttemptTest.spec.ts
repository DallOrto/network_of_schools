import nock from "nock";
import { unauthRequest, superAppRequest, internalRequest, teacherToken, studentToken } from "../../setup";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest, mockIStudentRequest } from "../../helpers/mock";

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

describe("List Enrollment Attempts Controller", () => {
  it("should return PROCESSING attempt right after POST /students", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    await superAppRequest.post("/students").send(studentBody);

    const response = await superAppRequest.get(
      `/students/${studentBody.document}/enrollment-attempts`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toMatchObject({ status: "PROCESSING" });
  });

  it("should return APPROVED attempt after webhook callback", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    const createResponse = await superAppRequest.post("/students").send(studentBody);
    const attemptId = createResponse.body.enrollmentAttemptId;

    await internalRequest
      .post(`/internal/compliance-result/${attemptId}`)
      .send({
        jobId: "test-job-id",
        complianceId: "test-compliance-id",
        approved: true,
        reason: null,
        complianceStudentId: "test-compliance-student-id",
      });

    const response = await superAppRequest.get(
      `/students/${studentBody.document}/enrollment-attempts`
    );

    expect(response.status).toBe(200);
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
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));
    const studentBody = mockIStudentRequest(school.id);

    // 1ª tentativa
    const first = await superAppRequest.post("/students").send(studentBody);
    // 2ª tentativa com o mesmo documento
    const second = await superAppRequest.post("/students").send(studentBody);

    const response = await superAppRequest.get(
      `/students/${studentBody.document}/enrollment-attempts`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(new Date(response.body[0].attemptedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(response.body[1].attemptedAt).getTime()
    );

    // Apenas para evitar unused variable warning
    void first; void second;
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
