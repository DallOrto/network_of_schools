import { faker } from "@faker-js/faker";
import { WeekDays } from "@prisma/client";
import { createNetwork, createSchool, createClass } from "../../helpers/helper";
import { mockINetworkRequest, mockISchoolRequest } from "../../helpers/mock";
import { superAppRequest } from "../../setup";

describe("Delete Class Controller", () => {
  it("should be able to delete a Class", async () => {
    const network = await createNetwork(mockINetworkRequest());
    const school = await createSchool(mockISchoolRequest(network.id));

    const classItem = await createClass({
      name: faker.name.findName(),
      classDay: WeekDays.Monday,
      startTime: "08:00",
      endTime: "10:00",
      maxStudents: 30,
      schoolId: school.id
    });

    const response = await superAppRequest.delete(`/classes/${classItem.id}`);

    expect(response.status).toBe(204);
  });

  it("should return 400 when trying to delete a non-existent Class", async () => {
    const response = await superAppRequest.delete(
      "/classes/xxxxxxxx-yyyy-zzzz-aaaa-xxxyyyzzzaaa"
    );

    expect(response.status).toBe(404);
  });
});
