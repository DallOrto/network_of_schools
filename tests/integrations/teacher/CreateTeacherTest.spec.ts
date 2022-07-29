import { superAppRequest } from "../../setup";

describe("Create Teacher Controller", () => {
    it("should be able to create a Teacher", async () => {
            const teacherRequestBody = {
                name: "Name Test",
                document: "Doc Test",
                password: "Password Test",
                birthDate: "2001-07-22T04:09:04.552Z",
                schoolId: "106209e5-fcf8-4b8a-b0c2-b22769a9bd4c"
            }

            const teacherResponse = await superAppRequest
            .post("/teachers")
            .send(teacherRequestBody);

        expect(teacherResponse.status).toBe(201);
        expect(teacherResponse.body.error).toBeFalsy();
    });

});