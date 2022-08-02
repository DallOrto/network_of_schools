import {
  createClass,
  createNetwork,
  createSchool,
  createStudent
} from "../../helpers/helper";
import {
  mockIClassRequest,
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentClassTest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create StudentClass Controller", () => {
  it("should be able to create a StudentClass", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await createStudent(studentRequestBody);

    const classRequestBody = mockIClassRequest(schoolResponse.id);

    const classResponse = await createClass(classRequestBody);

    const studentClassRequestBody = mockIStudentClassTest(
      studentResponse.id,
      classResponse.id
    );

    const studentClassResponse = await superAppRequest
      .post("/classes/student")
      .send(studentClassRequestBody);

    expect(studentClassResponse.status).toBe(201);
    expect(studentClassResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a studentClass with invalid studentId and classId", async () => {
    const studentClassRequestBody = {
      studentId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa",
      classId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const studentClassResponse = await superAppRequest
      .post("/classes")
      .send(studentClassRequestBody);

    expect(studentClassResponse.status).toBe(400);
  });
});
