import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("Update School Controller", () => {
    it("should be able to update a School", async () => {
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

        const schoolRequestUpdateBody = {
            name: faker.name.findName(),
            address: faker.address.streetAddress(),
            networkId: networkResponse.body.id
        }

        const schoolUpdateResponse = await superAppRequest
            .put(`/schools/${schoolResponse.body.id}`)
            .send(schoolRequestUpdateBody);

        expect(schoolUpdateResponse.status).toBe(201);
        expect(schoolUpdateResponse.body.error).toBeFalsy();
    });

});