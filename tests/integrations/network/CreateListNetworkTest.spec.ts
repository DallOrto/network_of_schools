import { superAppRequest } from "../../setup";
import { faker } from "@faker-js/faker";

describe("Create Network Controller", () => {
    it("should be able to create a Network", async () => {
            const networkRequestBody = {
                name: faker.name.findName()
            }

            const networkResponse = await superAppRequest
            .post("/networks")
            .send(networkRequestBody);

        expect(networkResponse.status).toBe(201);
        expect(networkResponse.body.error).toBeFalsy();
    });

});