import { superAppRequest } from "../../setup";

describe("Create Network Controller", () => {
    it("should be able to create a Network", async () => {
            const networkRequestBody = {
                name: "Name Test"
            }

            const networkResponse = await superAppRequest
            .post("/networks")
            .send(networkRequestBody);


        expect(networkResponse.status).toBe(201);
        expect(networkResponse.body.error).toBeFalsy();
    });

});