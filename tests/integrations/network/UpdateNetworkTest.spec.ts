import { superAppRequest } from "../../setup";
import { mockINetworkRequest } from "../../helpers/mock";
import { createNetwork } from "../../helpers/helper";

describe("Update Network Controller", () => {
  it("should be able to update a Network", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const networkUpdateRequestBody = mockINetworkRequest();

    const networkUpdateResponse = await superAppRequest
      .put(`/networks/${networkResponse.id}`)
      .send(networkUpdateRequestBody);

    expect(networkUpdateResponse.status).toBe(201);
    expect(networkUpdateResponse.body.error).toBeFalsy();
    expect(networkUpdateResponse.body.name).toEqual(
      networkUpdateRequestBody.name
    );
  });
});
