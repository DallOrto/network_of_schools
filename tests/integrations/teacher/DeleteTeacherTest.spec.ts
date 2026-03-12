import { faker } from "@faker-js/faker";
import { createNetwork, createSchool, createTeacher } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Delete Teacher Controller", () => {
  it("should be able to delete a Teacher", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));

    const teacher = await createTeacher({
      name: faker.name.findName(),
      document: faker.datatype.number().toString(),
      password: faker.internet.password(),
      birthDate: faker.date.birthdate(),
      schoolId: school.id
    });

    const response = await superAppRequest.delete(`/teachers/${teacher.id}`);

    expect(response.status).toBe(204);
  });

  it("should return 400 when trying to delete a non-existent Teacher", async () => {
    const response = await superAppRequest.delete(
      "/teachers/xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    );

    expect(response.status).toBe(404);
  });
});
