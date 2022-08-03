import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockITeacherRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("List Teachers Controller", () => {
  it("should be able to list teachers", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const teacherRequestBody = mockITeacherRequest(schoolResponse.id);

    await superAppRequest.post("/teachers").send(teacherRequestBody);

    const teacherListResponse = await superAppRequest.get(
      `/teachers/list?schoolId=${schoolResponse.id}`
    );

    expect(teacherListResponse.status).toBe(201);
    expect(teacherListResponse.body.error).toBeFalsy();
    expect(teacherListResponse.body.length).toBe(1);
  });
});
