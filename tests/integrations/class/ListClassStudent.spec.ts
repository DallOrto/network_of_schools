import {
  createClass,
  createNetwork,
  createSchool,
  createStudent,
  createStudentClass
} from "../../helpers/helper";
import {
  mockIClassRequest,
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentClassTest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("List Class of Student Controller", () => {
  it("should be able to list the classes of student", async () => {
    const networkRequestBody = mockINetworkRequest();

    const networkResponse = await createNetwork(networkRequestBody);

    const schoolRequestBody = mockISchoolRequest(networkResponse.id);

    const schoolResponse = await createSchool(schoolRequestBody);

    const studentRequestBody = mockIStudentRequest(schoolResponse.id);

    const studentResponse = await createStudent(studentRequestBody);

    const classRequestBody = mockIClassRequest(schoolResponse.id);

    const classResponse = await createClass(classRequestBody);

    const studentClassRequestBody = mockIStudentClassTest(
      studentResponse.id,
      classResponse.id
    );

    await createStudentClass(studentClassRequestBody);

    const studentClassResponse = await superAppRequest.get(
      `/classes/listStudents?studentId=${studentResponse.id}`
    );

    expect(studentClassResponse.status).toBe(201);
    expect(studentClassResponse.body.error).toBeFalsy();
    expect(studentClassResponse.body.length).toBe(1);
  });
});
