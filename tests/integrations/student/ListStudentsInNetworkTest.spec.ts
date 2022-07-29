import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("List Student in Network Controller", () => {
    it("should be able to list student in network", async () => {
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

        const studentListInNetWorkResponse = await superAppRequest
        .get(`/students/listInNetwork?networkId=${networkResponse.body.id}`)

        expect(studentListInNetWorkResponse.status).toBe(201);
        expect(studentListInNetWorkResponse.body.error).toBeFalsy();
    });

});