import request from "supertest";
import { app } from "../../../src/app";
import { prismaDB } from "../../../src/database/prismaClient";

describe("Max Students Validation", () => {
  let networkId: string;
  let schoolId: string;
  let classId: string;

  beforeAll(async () => {
    const network = await prismaDB.network.create({
      data: { name: "Test Network" }
    });
    networkId = network.id;

    const school = await prismaDB.school.create({
      data: {
        name: "Test School",
        address: "Test Address",
        networkId
      }
    });
    schoolId = school.id;

    const classData = await prismaDB.class.create({
      data: {
        name: "Test Class",
        classDay: "Monday",
        startTime: "08:00",
        endTime: "09:00",
        maxStudents: 2,
        schoolId
      }
    });
    classId = classData.id;
  });

  afterAll(async () => {
    await prismaDB.studentClass.deleteMany({});
    await prismaDB.student.deleteMany({});
    await prismaDB.class.deleteMany({});
    await prismaDB.school.deleteMany({});
    await prismaDB.network.deleteMany({});
    await prismaDB.$disconnect();
  });

  it("should allow enrollment when class is not full", async () => {
    const student1 = await prismaDB.student.create({
      data: {
        name: "Student 1",
        document: "111.111.111-11",
        password: "123456",
        birthDate: new Date("2000-01-01"),
        schoolId
      }
    });

    const response = await request(app)
      .post("/classes/student")
      .send({
        studentId: student1.id,
        classId
      });

    expect(response.status).toBe(201);
  });

  it("should allow enrollment when class has one spot left", async () => {
    const student2 = await prismaDB.student.create({
      data: {
        name: "Student 2",
        document: "222.222.222-22",
        password: "123456",
        birthDate: new Date("2000-01-01"),
        schoolId
      }
    });

    const response = await request(app)
      .post("/classes/student")
      .send({
        studentId: student2.id,
        classId
      });

    expect(response.status).toBe(201);
  });

  it("should reject enrollment when class is full", async () => {
    const student3 = await prismaDB.student.create({
      data: {
        name: "Student 3",
        document: "333.333.333-33",
        password: "123456",
        birthDate: new Date("2000-01-01"),
        schoolId
      }
    });

    const response = await request(app)
      .post("/classes/student")
      .send({
        studentId: student3.id,
        classId
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("maximum capacity");
  });
});