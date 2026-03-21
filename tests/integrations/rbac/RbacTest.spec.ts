import {
  superAppRequest,
  unauthRequest,
  teacherToken,
  studentToken,
  networkAdminToken,
  schoolAdminToken,
} from "../../setup";
import { createNetwork, createSchool } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest, mockITeacherRequest, mockIStudentRequest, mockIClassRequest, mockISchoolAdminRequest } from "../../helpers/mock";

// Helpers de request com roles específicos
const teacherRequest = {
  post: (url: string) => unauthRequest.post(url).set("Authorization", `Bearer ${teacherToken}`),
  get: (url: string) => unauthRequest.get(url).set("Authorization", `Bearer ${teacherToken}`),
  put: (url: string) => unauthRequest.put(url).set("Authorization", `Bearer ${teacherToken}`),
  delete: (url: string) => unauthRequest.delete(url).set("Authorization", `Bearer ${teacherToken}`),
};

const studentRequest = {
  post: (url: string) => unauthRequest.post(url).set("Authorization", `Bearer ${studentToken}`),
  get: (url: string) => unauthRequest.get(url).set("Authorization", `Bearer ${studentToken}`),
  put: (url: string) => unauthRequest.put(url).set("Authorization", `Bearer ${studentToken}`),
  delete: (url: string) => unauthRequest.delete(url).set("Authorization", `Bearer ${studentToken}`),
};

const networkAdminRequest = {
  post: (url: string) => unauthRequest.post(url).set("Authorization", `Bearer ${networkAdminToken}`),
  get: (url: string) => unauthRequest.get(url).set("Authorization", `Bearer ${networkAdminToken}`),
  put: (url: string) => unauthRequest.put(url).set("Authorization", `Bearer ${networkAdminToken}`),
  delete: (url: string) => unauthRequest.delete(url).set("Authorization", `Bearer ${networkAdminToken}`),
};

const schoolAdminRequest = {
  post: (url: string) => unauthRequest.post(url).set("Authorization", `Bearer ${schoolAdminToken}`),
  get: (url: string) => unauthRequest.get(url).set("Authorization", `Bearer ${schoolAdminToken}`),
  put: (url: string) => unauthRequest.put(url).set("Authorization", `Bearer ${schoolAdminToken}`),
  delete: (url: string) => unauthRequest.delete(url).set("Authorization", `Bearer ${schoolAdminToken}`),
};

// ─── authorize() ──────────────────────────────────────────────────────────────

describe("RBAC — authorize middleware", () => {
  it("teacher → 403 on POST /admins (super_admin and network_admin only)", async () => {
    const response = await teacherRequest.post("/admins").send(mockISchoolAdminRequest("any-school-id"));
    expect(response.status).toBe(403);
  });

  it("student → 403 on POST /admins (super_admin and network_admin only)", async () => {
    const response = await studentRequest.post("/admins").send(mockISchoolAdminRequest("any-school-id"));
    expect(response.status).toBe(403);
  });

  it("school_admin → 403 on POST /admins (super_admin and network_admin only)", async () => {
    const response = await schoolAdminRequest.post("/admins").send(mockISchoolAdminRequest("any-school-id"));
    expect(response.status).toBe(403);
  });

  it("network_admin → not 403 on POST /admins (allowed role)", async () => {
    const response = await networkAdminRequest.post("/admins").send(mockISchoolAdminRequest("any-school-id"));
    expect(response.status).not.toBe(403);
  });

  it("teacher → 403 on POST /networks (super_admin only)", async () => {
    const response = await teacherRequest.post("/networks").send(mockINetworkRequest());
    expect(response.status).toBe(403);
    expect(response.body.message).toContain("permissão insuficiente");
  });

  it("student → 403 on POST /networks (super_admin only)", async () => {
    const response = await studentRequest.post("/networks").send(mockINetworkRequest());
    expect(response.status).toBe(403);
  });

  it("teacher → 403 on POST /teachers (admin-only)", async () => {
    const response = await teacherRequest.post("/teachers").send({});
    expect(response.status).toBe(403);
  });

  it("student → 403 on POST /teachers (admin-only)", async () => {
    const response = await studentRequest.post("/teachers").send({});
    expect(response.status).toBe(403);
  });

  it("teacher → 403 on POST /students (admin-only)", async () => {
    const response = await teacherRequest.post("/students").send({});
    expect(response.status).toBe(403);
  });

  it("student → 403 on DELETE /students/:id (admin-only)", async () => {
    const response = await studentRequest.delete("/students/any-id");
    expect(response.status).toBe(403);
  });

  it("teacher → 403 on DELETE /teachers/:id (admin-only)", async () => {
    const response = await teacherRequest.delete("/teachers/any-id");
    expect(response.status).toBe(403);
  });

  it("teacher → 403 on POST /classes (admin-only)", async () => {
    const response = await teacherRequest.post("/classes").send({});
    expect(response.status).toBe(403);
  });

  it("student → 403 on GET /students/listInNetwork (admin-only)", async () => {
    const response = await studentRequest.get("/students/listInNetwork");
    expect(response.status).toBe(403);
  });

  it("teacher → not 403 on GET /teachers/list (all roles allowed)", async () => {
    const response = await teacherRequest.get("/teachers/list");
    expect(response.status).not.toBe(403);
  });

  it("student → not 403 on GET /teachers/list (all roles allowed)", async () => {
    const response = await studentRequest.get("/teachers/list");
    expect(response.status).not.toBe(403);
  });

  it("teacher → not 403 on GET /classes/listStudents (all roles allowed)", async () => {
    const response = await teacherRequest.get("/classes/listStudents");
    expect(response.status).not.toBe(403);
  });
});

// ─── requireSelf ──────────────────────────────────────────────────────────────

describe("RBAC — requireSelf middleware", () => {
  it("teacher → 403 when updating a different teacher", async () => {
    // teacherToken has id: "test-teacher-id", tries to update "other-teacher-id"
    const response = await teacherRequest
      .put("/teachers/other-teacher-id")
      .send({ name: "New Name" });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("próprios dados");
  });

  it("student → 403 when updating a different student", async () => {
    // studentToken has id: "test-student-id", tries to update "other-student-id"
    const response = await studentRequest
      .put("/students/other-student-id")
      .send({ name: "New Name" });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("próprios dados");
  });

  it("super_admin → not 403 when updating any teacher (bypasses requireSelf)", async () => {
    // Super admin is not blocked by requireSelf
    const response = await superAppRequest
      .put("/teachers/any-teacher-id")
      .send({ name: "New Name" });

    // Must not be 403 — may be 400 from service (teacher not found), but not a scope error
    expect(response.status).not.toBe(403);
  });

  it("super_admin → not 403 when updating any student (bypasses requireSelf)", async () => {
    const response = await superAppRequest
      .put("/students/any-student-id")
      .send({ name: "New Name" });

    expect(response.status).not.toBe(403);
  });
});

// ─── requireSameSchool ────────────────────────────────────────────────────────

describe("RBAC — requireSameSchool middleware", () => {
  // schoolAdminToken has schoolId: "test-school-id"
  // We send a DIFFERENT schoolId in the body → 403

  it("school_admin → 403 when creating a teacher in a different school", async () => {
    const response = await schoolAdminRequest
      .post("/teachers")
      .send(mockITeacherRequest("different-school-id"));

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("outra escola");
  });

  it("school_admin → 403 when creating a student in a different school", async () => {
    const response = await schoolAdminRequest
      .post("/students")
      .send(mockIStudentRequest("different-school-id"));

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("outra escola");
  });

  it("school_admin → 403 when creating a class in a different school", async () => {
    const response = await schoolAdminRequest
      .post("/classes")
      .send(mockIClassRequest("different-school-id"));

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("outra escola");
  });

  it("super_admin → bypasses school scope check on POST /teachers", async () => {
    // super_admin should not be blocked by requireSameSchool
    // It may fail at service level (school not found), but not at middleware level
    const response = await superAppRequest
      .post("/teachers")
      .send(mockITeacherRequest("any-school-id"));

    expect(response.status).not.toBe(403);
  });

  it("network_admin → bypasses school scope check on POST /teachers", async () => {
    // network_admin also bypasses requireSameSchool (school-level restriction)
    const response = await networkAdminRequest
      .post("/teachers")
      .send(mockITeacherRequest("any-school-id"));

    expect(response.status).not.toBe(403);
  });
});

// ─── requireSameNetwork ───────────────────────────────────────────────────────

describe("RBAC — requireSameNetwork middleware", () => {
  it("network_admin → 403 when updating a network that is not theirs", async () => {
    // Create a real network via super_admin
    const network = await createNetwork(mockINetworkRequest());

    // networkAdminToken has networkId: "test-network-id" (different from the real one)
    const response = await networkAdminRequest
      .put(`/networks/${network.id}`)
      .send({ name: "Hacked Name" });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("não administra esta rede");
  });

  it("super_admin → not 403 when updating any network", async () => {
    const network = await createNetwork(mockINetworkRequest());

    const response = await superAppRequest
      .put(`/networks/${network.id}`)
      .send({ name: "Updated Name" });

    expect(response.status).not.toBe(403);
  });
});
