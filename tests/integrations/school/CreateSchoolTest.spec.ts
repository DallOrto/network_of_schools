import { superAppRequest } from "../../setup";

describe("Create School Controller", () => {
    it("should be able to create a School", async () => {
            const schoolRequestBody = {
                "name": "School Test",
                "address": "Cidade Test",
                "networkId": "ab982fde-c58b-4d3f-9820-bb867269ac57"
            }

            const schoolResponse = await superAppRequest
            .post("/schools")
            .send(schoolRequestBody);


        expect(schoolResponse.status).toBe(201);
        expect(schoolResponse.body.error).toBeFalsy();
    });

});