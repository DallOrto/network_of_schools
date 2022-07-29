import { superAppRequest } from "../../setup";

describe("Create Student Controller", () => {
    it("should be able to create a Student", async () => {
            const studentRequestBody = {
                name: "Name Test",
                document: "Doc Test",
                password: "Password Test",
                birthDate:  "2001-07-22T04:09:04.552Z",
                schoolId: "106209e5-fcf8-4b8a-b0c2-b22769a9bd4c"
            }

            const studentResponse = await superAppRequest
            .post("/students")
            .send(studentRequestBody);

        expect(studentResponse.status).toBe(201);
        expect(studentResponse.body.error).toBeFalsy();
    });

});