import { superAppRequest } from "../../setup";

describe("Create StudentClass Controller", () => {
    it("should be able to create a StudentClass", async () => {
            const studentClassRequestBody = {
                studentId: "6fafe55d-8e06-43a2-8a71-0978d32acb2c",
	            classId: "86564eb1-7266-4afb-bf5c-6aed7b24b1f1"
            }

            const studentClassResponse = await superAppRequest
            .post("/classes/student")
            .send(studentClassRequestBody);


        expect(studentClassResponse.status).toBe(201);
        expect(studentClassResponse.body.error).toBeFalsy();
    });

});