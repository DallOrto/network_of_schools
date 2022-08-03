import { faker } from "@faker-js/faker";
import {
  createNetwork,
  createSchool,
  createTeacher
} from "../../helpers/helper";
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

    const teacherResponse = await createTeacher(teacherRequestBody);

    const teacherUpdateRequestBody = mockITeacherRequest(schoolResponse.id);

    const teacherUpdateResponse = await superAppRequest
      .put(`/teachers/${teacherResponse.id}`)
      .send(teacherUpdateRequestBody);

    expect(teacherUpdateResponse.status).toBe(201);
    expect(teacherUpdateResponse.body.error).toBeFalsy();
    expect(teacherUpdateResponse.body.name).toEqual(
      teacherUpdateRequestBody.name
    );
    expect(teacherUpdateResponse.body.document).toEqual(
      teacherUpdateRequestBody.document
    );
    expect(teacherUpdateResponse.body.password).toEqual(
      teacherUpdateRequestBody.password
    );
    expect(teacherUpdateResponse.body.schoolId).toEqual(
      teacherUpdateRequestBody.schoolId
    );
  });

  it("should not be able to update a Teacher with invalid schoolId", async () => {
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
    expect(teacherResponse.body).toHaveProperty("message");
  });
});
