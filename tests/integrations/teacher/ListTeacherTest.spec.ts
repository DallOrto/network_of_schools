import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("List Teachers Controller", () => {
    it("should be able to list teachers", async () => {
        const networkRequestBody = {
            name: faker.name.findName()
        }
        const networkResponse = await superAppRequest
            .post("/networks")
            .send(networkRequestBody);

        const schoolRequestBody = {
                name: faker.name.findName(),
                address: faker.address.streetAddress(),
                networkId: networkResponse.body.id
            }

            const schoolResponse = await superAppRequest
            .post("/schools")
            .send(schoolRequestBody);

        const teacherRequestBody = {
                name: faker.name.findName(),
                document: faker.datatype.number().toString(),
                password: faker.internet.password(),
                birthDate:  faker.date.birthdate(),
                schoolId: schoolResponse.body.id
            }

            await superAppRequest
            .post("/teachers")
            .send(teacherRequestBody);

        const teacherListResponse = await superAppRequest
        .get(`/teachers/list?schoolId=${schoolResponse.body.id}`)

        expect(teacherListResponse.status).toBe(201);
        expect(teacherListResponse.body.error).toBeFalsy();
    });

});