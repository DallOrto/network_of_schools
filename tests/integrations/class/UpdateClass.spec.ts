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
});
