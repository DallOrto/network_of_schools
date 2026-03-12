import { faker } from "@faker-js/faker";
import {
  createClass,
  createNetwork,
  createSchool,
  createStudent,
  createStudentClass
} from "../../helpers/helper";
import {
  mockINetworkRequest,
  mockISchoolRequest,
  mockIStudentRequest
} from "../../helpers/mock";
import { superAppRequest } from "../../setup";
import { WeekDays } from "@prisma/client";

describe("Schedule Conflict Validation", () => {
  it("should allow enrollment when there is no schedule conflict (adjacent times)", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentResponse = await createStudent(mockIStudentRequest(schoolResponse.id));

    const class1Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    const class2Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Monday,
      startTime: "10:00",
      endTime: "12:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    const response = await superAppRequest
      .post("/classes/student")
      .send({
        studentId: studentResponse.id,
        classId: class2Response.id
      });

    expect(response.status).toBe(201);
  });

  it("should throw error when there is schedule conflict on same day", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentResponse = await createStudent(mockIStudentRequest(schoolResponse.id));

    const class1Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    const class2Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Monday,
      startTime: "09:00",
      endTime: "11:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    const response = await superAppRequest
      .post("/classes/student")
      .send({
        studentId: studentResponse.id,
        classId: class2Response.id
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Schedule conflict");
  });

  it("should allow enrollment on different days even with same time", async () => {
    const networkResponse = await createNetwork(mockINetworkRequest());
    const schoolResponse = await createSchool(mockISchoolRequest(networkResponse.id));
    const studentResponse = await createStudent(mockIStudentRequest(schoolResponse.id));

    const class1Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    const class2Response = await createClass({
      name: faker.datatype.uuid(),
      classDay: WeekDays.Tuesday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    const response = await superAppRequest
      .post("/classes/student")
      .send({
        studentId: studentResponse.id,
        classId: class2Response.id
      });

    expect(response.status).toBe(201);
  });
});
