import { ListEnrollmentAttemptService } from "../../../../src/services/enrollmentAttempt/ListEnrollmentAttemptService";
import { IListEnrollmentAttemptRepository } from "../../../../src/domain/interfaces/repositories/enrollmentAttempt/IListEnrollmentAttemptRepository";
import { ListEnrollmentAttemptResponse } from "../../../../src/domain/dtos/enrollmentAttempt/ListEnrollmentAttemptDTO";

const fakeApprovedAttempt: ListEnrollmentAttemptResponse = {
  id: "attempt-1",
  status: "APPROVED",
  complianceId: "compliance-1",
  complianceStudentId: "cs-1",
  studentId: "student-1",
  rejectionReason: null,
  attemptedAt: new Date("2026-04-08T10:00:00Z"),
};

const fakeRejectedAttempt: ListEnrollmentAttemptResponse = {
  id: "attempt-2",
  status: "REJECTED",
  complianceId: "compliance-2",
  complianceStudentId: "cs-1",
  studentId: null,
  rejectionReason: "B",
  attemptedAt: new Date("2026-04-07T10:00:00Z"),
};

const makeRepository = (result: ListEnrollmentAttemptResponse[]): jest.Mocked<IListEnrollmentAttemptRepository> => ({
  findByDocument: jest.fn().mockResolvedValue(result),
});

describe("ListEnrollmentAttemptService", () => {
  it("deve retornar a lista de tentativas para o documento informado", async () => {
    const repo = makeRepository([fakeApprovedAttempt, fakeRejectedAttempt]);
    const service = new ListEnrollmentAttemptService(repo);

    const result = await service.execute({ document: "12345678900" });

    expect(repo.findByDocument).toHaveBeenCalledWith("12345678900");
    expect(result).toHaveLength(2);
  });

  it("deve retornar lista vazia quando não há tentativas para o documento", async () => {
    const repo = makeRepository([]);
    const service = new ListEnrollmentAttemptService(repo);

    const result = await service.execute({ document: "00000000000" });

    expect(result).toHaveLength(0);
  });

  it("deve retornar tentativas com status e campos corretos", async () => {
    const repo = makeRepository([fakeApprovedAttempt]);
    const service = new ListEnrollmentAttemptService(repo);

    const result = await service.execute({ document: "12345678900" });

    expect(result[0]).toMatchObject({
      status: "APPROVED",
      complianceId: "compliance-1",
      studentId: "student-1",
      rejectionReason: null,
    });
  });

  it("deve retornar rejectionReason preenchido quando tentativa for REJECTED", async () => {
    const repo = makeRepository([fakeRejectedAttempt]);
    const service = new ListEnrollmentAttemptService(repo);

    const result = await service.execute({ document: "12345678900" });

    expect(result[0]).toMatchObject({
      status: "REJECTED",
      studentId: null,
      rejectionReason: "B",
    });
  });
});
