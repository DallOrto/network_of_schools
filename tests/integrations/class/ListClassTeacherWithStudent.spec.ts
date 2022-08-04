import {
  createClass,
  createNetwork,
  createSchool,
  createTeacher,
  createTeacherClass
} from "../../helpers/helper";
import {
  mockIClassRequest,
  mockINetworkRequest,
  mockISchoolRequest,
  mockITeacherClassTest,
  mockITeacherRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("List Class of Teacher With Students Controller", () => {
  it("should be able to list the classes of teacher with students", async () => {
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

    await createTeacherClass(teacherClassRequestBody);

    const teacherClassResponse = await superAppRequest.get(
      `/classes/listTeachers?teacherId=${teacherResponse.id}`
    );

    expect(teacherClassResponse.status).toBe(201);
    expect(teacherClassResponse.body.error).toBeFalsy();
    expect(teacherClassResponse.body.length).toBe(1);
  });
});
