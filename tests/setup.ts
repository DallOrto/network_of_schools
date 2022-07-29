import request from "supertest";
import dotenv from 'dotenv';
import { PrismaClient } from '.prisma/client';
import { app } from "../src/app";

dotenv.config({ path: '.env.test' });

const dbUser = process.env.DATABASE_USER;
const dbPass = process.env.DATABASE_PASS;
const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_NAME;

process.env.DATABASE_URL = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=public`;

const prismaClient = new PrismaClient();

beforeAll(()=> {
  return prismaClient.$connect();
})

afterAll(()=> {
  return
})

export const superAppRequest = request(app)