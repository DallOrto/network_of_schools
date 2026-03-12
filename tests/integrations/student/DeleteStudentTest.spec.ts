import { faker } from "@faker-js/faker";
import { createNetwork, createSchool, createStudent } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Delete Student Controller", () => {
  it("should be able to delete a Student", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));

    const student = await createStudent({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: school.id
    });

    const response = await superAppRequest.delete(`/students/${student.id}`);

    expect(response.status).toBe(204);
  });

  it("should return 400 when trying to delete a non-existent Student", async () => {
    const response = await superAppRequest.delete(
      "/students/xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    );

    expect(response.status).toBe(404);
  });
});
