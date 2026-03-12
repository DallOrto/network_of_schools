import { faker } from "@faker-js/faker";
import { createNetwork, createSchool, createTeacher, createStudent } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { superAppRequest, unauthRequest } from "../../setup";

async function setupSchool() {
  const network = await createNetwork(mockINetworkRequest());
  const school = await createSchool(mockISchoolRequest(network.id));
  return school;
}

describe("Auth - POST /auth/login", () => {
  it("should login with valid teacher credentials and return a token", async () => {
    const school = await setupSchool();
    const password = faker.internet.password();

    const teacher = await createTeacher({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password,
      birthDate: faker.date.birthdate(),
      schoolId: school.id
    });

    const response = await unauthRequest.post("/auth/login").send({
      document: teacher.document,
      password,
      role: "teacher"
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("should login with valid student credentials and return a token", async () => {
    const school = await setupSchool();
    const password = faker.internet.password();

    const student = await createStudent({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password,
      birthDate: faker.date.birthdate(),
      schoolId: school.id
    });

    const response = await unauthRequest.post("/auth/login").send({
      document: student.document,
      password,
      role: "student"
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 with wrong password", async () => {
    const school = await setupSchool();

    const teacher = await createTeacher({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: "correct-password",
      birthDate: faker.date.birthdate(),
      schoolId: school.id
    });

    const response = await unauthRequest.post("/auth/login").send({
      document: teacher.document,
      password: "wrong-password",
      role: "teacher"
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 401 with non-existent document", async () => {
    const response = await unauthRequest.post("/auth/login").send({
      document: "document-that-does-not-exist",
      password: "any-password",
      role: "teacher"
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("Auth - Bearer Token validation", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await unauthRequest.get("/networks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not provided");
  });

  it("should return 401 when an invalid token is provided", async () => {
    const response = await unauthRequest
      .get("/networks")
      .set("Authorization", "Bearer invalid.token.here");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  it("should return 401 when Authorization header is malformed", async () => {
    const response = await unauthRequest
      .get("/networks")
      .set("Authorization", "NotBearer sometoken");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not provided");
  });

  it("should allow access when a valid token is provided", async () => {
    const response = await superAppRequest.get("/teachers/list");

    expect(response.status).not.toBe(401);
  });
});
