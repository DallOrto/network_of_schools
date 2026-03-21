import jwt from "jsonwebtoken";
import { superAppRequest, unauthRequest } from "../../setup";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest, mockINetworkAdminRequest, mockISchoolAdminRequest } from "../../helpers/mock";

describe("Create Admin Controller", () => {
  describe("super_admin criando network_admin", () => {
    it("deve criar network_admin com networkId válido", async () => {
      const network = await createNetwork(mockINetworkRequest());

      const response = await superAppRequest
        .post("/admins")
        .send(mockINetworkAdminRequest(network.id));

      expect(response.status).toBe(201);
      expect(response.body.role).toBe("network_admin");
      expect(response.body.networkId).toBe(network.id);
      expect(response.body.password).toBeUndefined();
    });

    it("deve retornar 400 quando networkId está ausente", async () => {
      const response = await superAppRequest.post("/admins").send({
        name: "Admin",
        document: "10000000001",
        password: "senha123",
        role: "network_admin",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar 404 quando a rede não existe", async () => {
      const response = await superAppRequest.post("/admins").send(
        mockINetworkAdminRequest("00000000-0000-0000-0000-000000000000")
      );

      expect(response.status).toBe(404);
    });
  });

  describe("super_admin criando school_admin", () => {
    it("deve criar school_admin com schoolId válido", async () => {
      const network = await createNetwork(mockINetworkRequest());
      const school = await createSchool(mockISchoolRequest(network.id));

      const response = await superAppRequest
        .post("/admins")
        .send(mockISchoolAdminRequest(school.id));

      expect(response.status).toBe(201);
      expect(response.body.role).toBe("school_admin");
      expect(response.body.schoolId).toBe(school.id);
      expect(response.body.password).toBeUndefined();
    });

    it("deve retornar 400 quando schoolId está ausente", async () => {
      const response = await superAppRequest.post("/admins").send({
        name: "Admin",
        document: "10000000002",
        password: "senha123",
        role: "school_admin",
      });

      expect(response.status).toBe(400);
    });

    it("deve retornar 404 quando a escola não existe", async () => {
      const response = await superAppRequest.post("/admins").send(
        mockISchoolAdminRequest("00000000-0000-0000-0000-000000000000")
      );

      expect(response.status).toBe(404);
    });
  });

  describe("network_admin criando school_admin", () => {
    it("deve criar school_admin em escola da sua própria rede", async () => {
      const network = await createNetwork(mockINetworkRequest());
      const school = await createSchool(mockISchoolRequest(network.id));

      // Token do network_admin com o networkId da rede recém criada
      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "dynamic-netadmin-id", document: "55500000001", role: "network_admin", networkId: network.id },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send(mockISchoolAdminRequest(school.id));

      expect(response.status).toBe(201);
      expect(response.body.role).toBe("school_admin");
    });

    it("deve retornar 403 ao tentar criar school_admin em escola de outra rede", async () => {
      const networkA = await createNetwork(mockINetworkRequest());
      const networkB = await createNetwork(mockINetworkRequest());
      const schoolInB = await createSchool(mockISchoolRequest(networkB.id));

      // Token com networkId da rede A, mas tenta criar em escola da rede B
      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "dynamic-netadmin-id-2", document: "55500000002", role: "network_admin", networkId: networkA.id },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send(mockISchoolAdminRequest(schoolInB.id));

      expect(response.status).toBe(403);
    });

    it("deve retornar 403 ao tentar criar network_admin", async () => {
      const network = await createNetwork(mockINetworkRequest());

      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "dynamic-netadmin-id-3", document: "55500000003", role: "network_admin", networkId: network.id },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send(mockINetworkAdminRequest(network.id));

      expect(response.status).toBe(403);
    });
  });

  describe("roles sem permissão", () => {
    it("deve retornar 401 sem token", async () => {
      const response = await unauthRequest.post("/admins").send({});
      expect(response.status).toBe(401);
    });

    it("deve retornar 403 para school_admin", async () => {
      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "schooladmin-id", document: "66600000001", role: "school_admin", schoolId: "any-school" },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "X", document: "99", password: "x", role: "school_admin", schoolId: "any" });

      expect(response.status).toBe(403);
    });

    it("deve retornar 403 para teacher", async () => {
      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "teacher-id", document: "77700000001", role: "teacher", schoolId: "any-school" },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "X", document: "99", password: "x", role: "school_admin", schoolId: "any" });

      expect(response.status).toBe(403);
    });

    it("deve retornar 403 para student", async () => {
      const jwtSecret = process.env.JWT_SECRET ?? "test-jwt-secret";
      const token = jwt.sign(
        { id: "student-id", document: "88800000001", role: "student", schoolId: "any-school" },
        jwtSecret,
        { expiresIn: "1d" }
      );

      const response = await unauthRequest
        .post("/admins")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "X", document: "99", password: "x", role: "school_admin", schoolId: "any" });

      expect(response.status).toBe(403);
    });
  });
});
