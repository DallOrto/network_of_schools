import { faker } from "@faker-js/faker";
import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockITeacherRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create Teacher Controller", () => {
  it("should be able to create a Teacher", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const teacherRequestBody = mockITeacherRequest(schoolResponse.id);

    const teacherResponse = await superAppRequest
      .post("/teachers")
      .send(teacherRequestBody);

    expect(teacherResponse.status).toBe(201);
    expect(teacherResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a Teacher with invalid schoolId", async () => {
    const teacherRequestBody = {
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const teacherResponse = await superAppRequest
      .post("/teachers")
      .send(teacherRequestBody);

    expect(teacherResponse.status).toBe(400);
  });
});
