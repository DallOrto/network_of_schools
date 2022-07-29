import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("Update Network Controller", () => {
    it("should be able to update a Network", async () => {
            const networkRequestBody = {
                name: faker.name.findName()
            }

            const networkResponse = await superAppRequest
            .post("/networks")
            .send(networkRequestBody);

            const networkRequestUpdateBody = {
                name: faker.name.findName()
            }

            const networkUpdateResponse = await superAppRequest
            .put(`/networks/${networkResponse.body.id}`)
            .send(networkRequestUpdateBody)

        expect(networkUpdateResponse.status).toBe(201);
        expect(networkUpdateResponse.body.error).toBeFalsy();
    });

});