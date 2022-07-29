import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Create Class Controller", () => {
    it("should be able to create a Class", async () => {
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

        const classRequestBody = {
                name: faker.name.findName(),
                classDay: faker.date.weekday(),
                time: faker.date.past(),
                schoolId: schoolResponse.body.id
            }

            const classResponse = await superAppRequest
            .post("/classes")
            .send(classRequestBody);

        expect(classResponse.status).toBe(201);
        expect(classResponse.body.error).toBeFalsy();
    });

});