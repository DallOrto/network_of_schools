import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Create Teacher Controller", () => {
    it("should be able to create a Teacher", async () => {
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

            const teacherResponse = await superAppRequest
            .post("/teachers")
            .send(teacherRequestBody);

        const teacherUpdateRequestBody = {
            name: faker.name.findName(),
            document: faker.datatype.number().toString(),
            password: faker.internet.password(),
            birthDate: faker.date.birthdate(),
            schoolId: schoolResponse.body.id
        }

            const teacherUpdateResponse = await superAppRequest
            .put(`/teachers/${teacherResponse.body.id}`)
            .send(teacherUpdateRequestBody)

        expect(teacherUpdateResponse.status).toBe(201);
        expect(teacherUpdateResponse.body.error).toBeFalsy();
    });

});