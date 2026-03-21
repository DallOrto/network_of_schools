import request from "supertest";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import nock from "nock";
import { PrismaClient } from '.prisma/client';
import { app } from "../src/app";

dotenv.config({ path: '.env.test' });

const dbUser = process.env.DATABASE_USER;
const dbPass = process.env.DATABASE_PASS;
const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_NAME;

process.env.DATABASE_URL = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=public`;

const complianceApiUrl = process.env.COMPLIANCE_API_URL || "https://compliance-student.onrender.com";
const complianceApiOrigin = new URL(complianceApiUrl).origin;

nock(complianceApiOrigin)
  .post("/students/compliance")
  .reply(200, { approved: true })
  .persist();

const prismaClient = new PrismaClient();

beforeAll(()=> {
  return prismaClient.$connect();
})

afterAll(()=> {
  return
})

const testJwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";

// Token principal usado em todos os testes de integração existentes.
// Usa super_admin para que possa criar Networks, Schools, Teachers, Students e Classes
// sem ser bloqueado pelo RBAC.
export const authToken = jwt.sign(
  { id: "test-user-id", document: "00000000", role: "super_admin" as const },
  testJwtSecret,
  { expiresIn: "1d" }
);

// Tokens auxiliares para testes de RBAC
export const teacherToken = jwt.sign(
  { id: "test-teacher-id", document: "11111111", role: "teacher" as const, schoolId: "test-school-id" },
  testJwtSecret,
  { expiresIn: "1d" }
);

export const studentToken = jwt.sign(
  { id: "test-student-id", document: "22222222", role: "student" as const, schoolId: "test-school-id" },
  testJwtSecret,
  { expiresIn: "1d" }
);

export const networkAdminToken = jwt.sign(
  { id: "test-netadmin-id", document: "33333333", role: "network_admin" as const, networkId: "test-network-id" },
  testJwtSecret,
  { expiresIn: "1d" }
);

export const schoolAdminToken = jwt.sign(
  { id: "test-schooladmin-id", document: "44444444", role: "school_admin" as const, networkId: "test-network-id", schoolId: "test-school-id" },
  testJwtSecret,
  { expiresIn: "1d" }
);

const _request = request(app);

export const superAppRequest = {
  post: (url: string) => _request.post(url).set("Authorization", `Bearer ${authToken}`),
  get: (url: string) => _request.get(url).set("Authorization", `Bearer ${authToken}`),
  put: (url: string) => _request.put(url).set("Authorization", `Bearer ${authToken}`),
  delete: (url: string) => _request.delete(url).set("Authorization", `Bearer ${authToken}`),
};

export const unauthRequest = _request;
