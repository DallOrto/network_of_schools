import { faker } from "@faker-js/faker";
import { createClass, createNetwork, createSchool } from "../../helpers/helper";
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

    const classResponse = await createClass(classRequestBody);

    const classUpdateRequestBody = mockIClassRequest(schoolResponse.id);

    const classUpdateResponse = await superAppRequest
      .put(`/classes/${classResponse.id}`)
      .send(classUpdateRequestBody);

    expect(classUpdateResponse.status).toBe(201);
    expect(classUpdateResponse.body.error).toBeFalsy();
    expect(classUpdateResponse.body.name).toEqual(classUpdateRequestBody.name);
    expect(classUpdateResponse.body.classDay).toEqual(
      classUpdateRequestBody.classDay
    );
    expect(classUpdateResponse.body.schoolId).toEqual(
      classUpdateRequestBody.schoolId
    );
  });

  it("should not be able to update a Class with invalid schoolId", async () => {
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
