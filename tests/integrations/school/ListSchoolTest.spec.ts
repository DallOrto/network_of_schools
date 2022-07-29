import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("List School Controller", () => {
    it("should be able to list Schools", async () => {
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

            await superAppRequest
            .post("/schools")
            .send(schoolRequestBody);

        const schoolListResponse = await superAppRequest
        .get(`/schools/list?networkId=${networkResponse.body.id}`)

        expect(schoolListResponse.status).toBe(201);
        expect(schoolListResponse.body.error).toBeFalsy();
    });

});