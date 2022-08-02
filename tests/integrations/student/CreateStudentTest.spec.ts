import { faker } from "@faker-js/faker";
import { createNetwork, createSchool } from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create Student Controller", () => {
  it("should be able to create a Student", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(201);
    expect(studentResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a Student with invalid schoolId", async () => {
    const studentRequestBody = {
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const studentResponse = await superAppRequest
      .post("/students")
      .send(studentRequestBody);

    expect(studentResponse.status).toBe(400);
  });
});
