import { superAppRequest } from "../../setup";
import { mockINetworkRequest } from "../../helpers/mock";

describe("Create Network Controller", () => {
  it("should be able to create a Network", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await superAppRequest
      .post("/networks")
      .send(networkRequestBody);

    expect(networkResponse.status).toBe(201);
    expect(networkResponse.body.error).toBeFalsy();
  });
});
