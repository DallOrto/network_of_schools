import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create Student Controller", () => {
  it("should be able to create a Student", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(201);
    expect(studentResponse.body.error).toBeFalsy();
  });
});
