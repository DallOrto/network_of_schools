import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("List Student Controller", () => {
    it("should be able to list student", async () => {
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

            await superAppRequest
            .post("/students")
            .send(studentRequestBody);

        const studentListResponse = await superAppRequest
        .get(`/students/list?schoolId=${schoolResponse.body.id}`)

        expect(studentListResponse.status).toBe(201);
        expect(studentListResponse.body.error).toBeFalsy();
    });

});