import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("List Student Controller", () => {
  it("should be able to list student", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    await superAppRequest.post("/students").send(studentRequestBody);

    const studentListResponse = await superAppRequest.get(
      `/students/list?schoolId=${schoolResponse.id}`
    );

    expect(studentListResponse.status).toBe(201);
    expect(studentListResponse.body.error).toBeFalsy();
    expect(studentListResponse.body.length).toBe(1);
  });
});
