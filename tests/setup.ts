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
  .post("/student")
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

export const authToken = jwt.sign(
  { id: "test-user-id", document: "00000000", role: "teacher" as const },
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
