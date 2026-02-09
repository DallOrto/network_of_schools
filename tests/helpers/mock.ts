import { faker } from "@faker-js/faker";
import { WeekDays } from "@prisma/client";

export function mockINetworkRequest() {
  const networkRequestBody = {
    name: faker.name.findName()
  };
  return networkRequestBody;
}

export function mockISchoolRequest(networkId: string) {
  const schoolRequestBody = {
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    networkId
  };
  return schoolRequestBody;
}

export function mockIStudentRequest(schoolId: string) {
  const studentRequestBody = {
    name: faker.name.findName(),
    document: faker.datatype.number().toString(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate(),
    schoolId
  };
  return studentRequestBody;
}

export function mockITeacherRequest(schoolId: string) {
  const teacherRequestBody = {
    name: faker.name.findName(),
    document: faker.datatype.number().toString(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate(),
    schoolId
  };
  return teacherRequestBody;
}

export function mockIClassRequest(schoolId: string) {
  const weekDays: WeekDays[] = [
    WeekDays.Monday,
    WeekDays.Tuesday,
    WeekDays.Wednesday,
    WeekDays.Thursday,
    WeekDays.Friday,
    WeekDays.Saturday,
    WeekDays.Sunday
  ];
  const classRequestBody = {
    name: faker.name.findName(),
    classDay: weekDays[Math.floor(Math.random() * weekDays.length)],
    startTime: "08:00",
    endTime: "10:00",
    schoolId,
    maxStudents: 30
  };
  return classRequestBody;
}

export function mockIStudentClassTest(studentId: string, classId: string) {
  const studentClassRequestBody = {
    studentId,
    classId
  };
  return studentClassRequestBody;
}

export function mockITeacherClassTest(teacherId: string, classId: string) {
  const teacherClassRequestBody = {
    teacherId,
    classId
  };
  return teacherClassRequestBody;
}
