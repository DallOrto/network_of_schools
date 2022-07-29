import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Update Student Controller", () => {
    it("should be able to update a Student", async () => {
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

        const studentUpdateRequestBody = {
            name: faker.name.findName(),
            document: faker.datatype.number().toString(),
            password: faker.internet.password(),
            birthDate:  faker.date.birthdate(),
            schoolId: schoolResponse.body.id
        }

        const studentUpdateResponse = await superAppRequest
            .put(`/students/${studentResponse.body.id}`)
            .send(studentUpdateRequestBody);

        expect(studentUpdateResponse.status).toBe(201);
        expect(studentUpdateResponse.body.error).toBeFalsy();
    });

});