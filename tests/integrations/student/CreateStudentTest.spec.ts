import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Create Student Controller", () => {
    it("should be able to create a Student", async () => {
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

        const studentRequestBody = {
                name: faker.name.findName(),
                document: faker.datatype.number().toString(),
                password: faker.internet.password(),
                birthDate:  faker.date.birthdate(),
                schoolId: schoolResponse.body.id
            }

            const studentResponse = await superAppRequest
            .post("/students")
            .send(studentRequestBody);

        expect(studentResponse.status).toBe(201);
        expect(studentResponse.body.error).toBeFalsy();
    });

});