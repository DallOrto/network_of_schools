import {
  CreateClassRequest,
  CreateClassResponse
} from "../../src/domain/dtos/class/ClassDTO";
import {
  CreateNetworkRequest,
  CreateNetworkResponse
} from "../../src/domain/dtos/network/NetworkDTO";
import {
  CreateSchoolRequest,
  CreateSchoolResponse
} from "../../src/domain/dtos/school/SchoolDTO";
import {
  CreateStudentRequest,
  CreateStudentResponse
} from "../../src/domain/dtos/student/StudentDTO";
import {
  CreateStudentClassRequest,
  CreateStudentClassResponse
} from "../../src/domain/dtos/studentClass/StudentClassDTO";
import {
  CreateTeacherRequest,
  CreateTeacherResponse
} from "../../src/domain/dtos/teacher/TeacherDTO";
import {
  CreateTeacherClassRequest,
  CreateTeacherClassResponse
} from "../../src/domain/dtos/teacherClass/TeacherClassDTO";
import { superAppRequest } from "../setup";

export async function createNetwork(body: CreateNetworkRequest) {
  const networkResponse = await superAppRequest.post("/networks").send(body);

  const createNetworkResponseBody =
    networkResponse.body as CreateNetworkResponse;

  return createNetworkResponseBody;
}

export async function createSchool(body: CreateSchoolRequest) {
  const schoolResponse = await superAppRequest.post("/schools").send(body);

  const createSchoolResponseBody = schoolResponse.body as CreateSchoolResponse;

  return createSchoolResponseBody;
}

export async function createTeacher(body: CreateTeacherRequest) {
  const teacherResponse = await superAppRequest.post("/teachers").send(body);

  const createTeacherResponseBody =
    teacherResponse.body as CreateTeacherResponse;

  return createTeacherResponseBody;
}

export async function createStudent(body: CreateStudentRequest) {
  const studentResponse = await superAppRequest.post("/students").send(body);

  const createStudentResponseBody =
    studentResponse.body as CreateStudentResponse;

  return createStudentResponseBody;
}

export async function createClass(body: CreateClassRequest) {
  const classResponse = await superAppRequest.post("/classes").send(body);

  const createClassResponseBody = classResponse.body as CreateClassResponse;

  return createClassResponseBody;
}

export async function createStudentClass(body: CreateStudentClassRequest) {
  const studentClassResponse = await superAppRequest
    .post("/classes/student")
    .send(body);

  const createStudentClassResponseBody =
    studentClassResponse.body as CreateStudentClassResponse;

  return createStudentClassResponseBody;
}

export async function createTeacherClass(body: CreateTeacherClassRequest) {
  const teacherClassResponse = await superAppRequest
    .post("/classes/teacher")
    .send(body);

  const createTeacherClassResponseBody =
    teacherClassResponse.body as CreateTeacherClassResponse;

  return createTeacherClassResponseBody;
}
