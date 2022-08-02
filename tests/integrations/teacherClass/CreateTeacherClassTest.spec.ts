import { faker } from "@faker-js/faker";
import {
  createClass,
  createNetwork,
  createSchool,
  createTeacher
} from "../../helpers/helper";
import {
  mockIClassRequest,
  mockINetworkRequest,
  mockISchoolRequest,
  mockITeacherClassTest,
  mockITeacherRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Create TeacherClass Controller", () => {
  it("should be able to create a TeacherClass", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const teacherRequestBody = mockITeacherRequest(schoolResponse.id);

    const teacherResponse = await createTeacher(teacherRequestBody);

    const classRequestBody = mockIClassRequest(schoolResponse.id);

    const classResponse = await createClass(classRequestBody);

    const teacherClassRequestBody = mockITeacherClassTest(
      teacherResponse.id,
      classResponse.id
    );

    const teacherClassResponse = await superAppRequest
      .post("/classes/teacher")
      .send(teacherClassRequestBody);

    expect(teacherClassResponse.status).toBe(201);
    expect(teacherClassResponse.body.error).toBeFalsy();
  });

  it("should not be able to create a teacherClass with invalid teacherId and classId", async () => {
    const teacherClassRequestBody = {
      studentId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa",
      classId: "xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    };

    const teacherClassResponse = await superAppRequest
      .post("/classes")
      .send(teacherClassRequestBody);

    expect(teacherClassResponse.status).toBe(400);
    expect(teacherClassResponse.body).toHaveProperty("message");
  });
});
