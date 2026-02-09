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

    // Turma 1: Segunda 08:00-10:00
    const class1Response = await createClass({
      name: "Turma 1",
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Turma 2: Segunda 10:00-12:00 (horário adjacente, não conflita)
    const class2Response = await createClass({
      name: "Turma 2",
      classDay: WeekDays.Monday,
      startTime: "10:00",
      endTime: "12:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Matricular na turma 1
    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    // Deve permitir matricular na turma 2 (horário adjacente)
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

    // Turma 1: Segunda 08:00-10:00
    const class1Response = await createClass({
      name: "Turma 1",
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Turma 2: Segunda 09:00-11:00 (conflita com turma 1)
    const class2Response = await createClass({
      name: "Turma 2",
      classDay: WeekDays.Monday,
      startTime: "09:00",
      endTime: "11:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Matricular na turma 1
    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    // Deve rejeitar matrícula na turma 2 (conflito de horário)
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

    // Turma 1: Segunda 08:00-10:00
    const class1Response = await createClass({
      name: "Turma 1",
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Turma 2: Terça 08:00-10:00 (mesmo horário, dia diferente)
    const class2Response = await createClass({
      name: "Turma 2",
      classDay: WeekDays.Tuesday,
      startTime: "08:00",
      endTime: "10:00",
      schoolId: schoolResponse.id,
      maxStudents: 30
    });

    // Matricular na turma 1
    await createStudentClass({
      studentId: studentResponse.id,
      classId: class1Response.id
    });

    // Deve permitir matricular na turma 2 (dia diferente)
    const response = await superAppRequest
      .post("/classes/student")
      .send({
        studentId: studentResponse.id,
        classId: class2Response.id
      });

    expect(response.status).toBe(201);
  });
});
