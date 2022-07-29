import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("Create School Controller", () => {
    it("should be able to create a School", async () => {
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

        expect(schoolResponse.status).toBe(201);
        expect(schoolResponse.body.error).toBeFalsy();
    });

});