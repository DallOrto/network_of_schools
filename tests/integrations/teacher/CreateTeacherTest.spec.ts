import { createNetwork, createSchool } from "../../helpers/helper";
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

    const teacherResponse = await superAppRequest
      .post("/teachers")
      .send(teacherRequestBody);

    expect(teacherResponse.status).toBe(201);
    expect(teacherResponse.body.error).toBeFalsy();
  });
});
