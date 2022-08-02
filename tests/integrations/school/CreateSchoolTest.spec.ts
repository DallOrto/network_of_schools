import { superAppRequest } from "../../setup";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { createNetwork } from "../../helpers/helper";
import { faker } from "@faker-js/faker";
import { AppError } from "../../../src/error/AppError";

describe("Create School Controller", () => {
  it("should be able to create a School", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await superAppRequest
      .post("/schools")
      .send(schoolRequestBody);

    expect(schoolResponse.status).toBe(201);
    expect(schoolResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a School with invalid networkId", async () => {
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
