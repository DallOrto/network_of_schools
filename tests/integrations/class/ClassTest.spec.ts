import { superAppRequest } from "../../setup";

describe("Create Class Controller", () => {
    it("should be able to create a Class", async () => {
            const classRequestBody = {
                name: "Name Test",
                classDay: "Terça-Feira",
                time: "2022-07-13T04:09:04.552Z",
                schoolId: "106209e5-fcf8-4b8a-b0c2-b22769a9bd4c"
            }

            const classResponse = await superAppRequest
            .post("/classes")
            .send(classRequestBody);

        expect(classResponse.status).toBe(201);
        expect(classResponse.body.error).toBeFalsy();
    });

});