import { prismaDB } from "../../../src/database/prismaClient";
import { superAppRequest } from "../../setup";

describe("Max Students Validation", () => {
  let networkId: string;
  let schoolId: string;
  let classId: string;
  const createdStudentIds: string[] = [];
  const createdUserIds: string[] = [];

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
    await prismaDB.studentClass.deleteMany({ where: { classId } });
    await prismaDB.student.deleteMany({ where: { id: { in: createdStudentIds } } });
    await prismaDB.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prismaDB.class.deleteMany({ where: { id: classId } });
    await prismaDB.school.deleteMany({ where: { id: schoolId } });
    await prismaDB.network.deleteMany({ where: { id: networkId } });
    await prismaDB.$disconnect();
  });

  async function createStudentDirect(doc: string): Promise<{ id: string }> {
    return prismaDB.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { document: doc, password: "123456", role: "student" }
      });
      const student = await tx.student.create({
        data: { userId: user.id, name: `Student ${doc}`, birthDate: new Date("2000-01-01"), schoolId }
      });
      createdStudentIds.push(student.id);
      createdUserIds.push(user.id);
      return student;
    });
  }

  it("should allow enrollment when class is not full", async () => {
    const student1 = await createStudentDirect("111-111-111-11");

    const response = await superAppRequest
      .post("/classes/student")
      .send({ studentId: student1.id, classId });

    expect(response.status).toBe(201);
  });

  it("should allow enrollment when class has one spot left", async () => {
    const student2 = await createStudentDirect("222-222-222-22");

    const response = await superAppRequest
      .post("/classes/student")
      .send({ studentId: student2.id, classId });

    expect(response.status).toBe(201);
  });

  it("should reject enrollment when class is full", async () => {
    const student3 = await createStudentDirect("333-333-333-33");

    const response = await superAppRequest
      .post("/classes/student")
      .send({ studentId: student3.id, classId });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("maximum capacity");
  });
});
