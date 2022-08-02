import { faker } from "@faker-js/faker";
import { CommandCompleteMessage } from "pg-protocol/dist/messages";
import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockIClassRequest,
  mockINetworkRequest,
  mockISchoolRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create Class Controller", () => {
  it("should be able to create a Class", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const classRequestBody = mockIClassRequest(schoolResponse.id);

    const classResponse = await superAppRequest
      .post("/classes")
      .send(classRequestBody);

    expect(classResponse.status).toBe(201);
    expect(classResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a Class with invalid schoolId", async () => {
    const classRequestBody = {
      name: faker.name.findName(),
      classDay: faker.date.weekday(),
      time: faker.date.past(),
      schoolId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const classResponse = await superAppRequest
      .post("/classes")
      .send(classRequestBody);

    expect(classResponse.status).toBe(400);
  });
});
