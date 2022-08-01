import {
  createNetwork,
  createSchool,
  createTeacher
} from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockITeacherRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create Teacher Controller", () => {
  it("should be able to create a Teacher", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const teacherRequestBody = mockITeacherRequest(schoolResponse.id);

    const teacherResponse = await createTeacher(teacherRequestBody);

    const teacherUpdateRequestBody = mockITeacherRequest(schoolResponse.id);

    const teacherUpdateResponse = await superAppRequest
      .put(`/teachers/${teacherResponse.id}`)
      .send(teacherUpdateRequestBody);

    expect(teacherUpdateResponse.status).toBe(201);
    expect(teacherUpdateResponse.body.error).toBeFalsy();
    expect(teacherUpdateResponse.body.name).toEqual(
      teacherUpdateRequestBody.name
    );
    expect(teacherUpdateResponse.body.document).toEqual(
      teacherUpdateRequestBody.document
    );
    expect(teacherUpdateResponse.body.password).toEqual(
      teacherUpdateRequestBody.password
    );
    expect(teacherUpdateResponse.body.schoolId).toEqual(
      teacherUpdateRequestBody.schoolId
    );
  });
});
