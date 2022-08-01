import {
  createNetwork,
  createSchool,
  createStudent
} from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Update Student Controller", () => {
  it("should be able to update a Student", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await createStudent(studentRequestBody);

    const studentUpdateRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentUpdateResponse = await superAppRequest
      .put(`/students/${studentResponse.id}`)
      .send(studentUpdateRequestBody);

    expect(studentUpdateResponse.status).toBe(201);
    expect(studentUpdateResponse.body.error).toBeFalsy();
    expect(studentUpdateResponse.body.name).toEqual(
      studentUpdateRequestBody.name
    );
    expect(studentUpdateResponse.body.document).toEqual(
      studentUpdateRequestBody.document
    );
    expect(studentUpdateResponse.body.password).toEqual(
      studentUpdateRequestBody.password
    );
    expect(studentUpdateResponse.body.schoolId).toEqual(
      studentUpdateRequestBody.schoolId
    );
  });
});
