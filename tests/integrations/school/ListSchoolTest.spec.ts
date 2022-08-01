import { superAppRequest } from "../../setup";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { createNetwork } from "../../helpers/helper";

describe("List School Controller", () => {
  it("should be able to list Schools", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    await superAppRequest.post("/schools").send(schoolRequestBody);

    const schoolListResponse = await superAppRequest.get(
      `/schools/list?networkId=${networkResponse.id}`
    );

    expect(schoolListResponse.status).toBe(201);
    expect(schoolListResponse.body.error).toBeFalsy();
    expect(schoolListResponse.body.length).toBe(1);
  });
});
