import { faker } from "@faker-js/faker";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Update School Controller", () => {
  it("should be able to update a School", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const schoolUpdateRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolUpdateResponse = await superAppRequest
      .put(`/schools/${schoolResponse.id}`)
      .send(schoolUpdateRequestBody);

    expect(schoolUpdateResponse.status).toBe(201);
    expect(schoolUpdateResponse.body.error).toBeFalsy();
    expect(schoolUpdateResponse.body.name).toEqual(
      schoolUpdateRequestBody.name
    );
    expect(schoolUpdateResponse.body.address).toEqual(
      schoolUpdateRequestBody.address
    );
    expect(schoolUpdateResponse.body.networkId).toEqual(
      schoolUpdateRequestBody.networkId
    );
  });

  it("should not be able to update a School with invalid networkId", async () => {
    const schoolRequestBody = {
      name: faker.name.findName(),
      address: faker.address.streetAddress(),
      networkId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const schoolResponse = await superAppRequest
      .post("/schools")
      .send(schoolRequestBody);

    expect(schoolResponse.status).toBe(400);
  });
});
