import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("List Student in Network Controller", () => {
  it("should be able to list student in network", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    await superAppRequest.post("/students").send(studentRequestBody);

    const studentListInNetWorkResponse = await superAppRequest.get(
      `/students/listInNetwork?networkId=${networkResponse.id}`
    );

    expect(studentListInNetWorkResponse.status).toBe(201);
    expect(studentListInNetWorkResponse.body.error).toBeFalsy();
    expect(studentListInNetWorkResponse.body.length).toBe(1);
  });
});
