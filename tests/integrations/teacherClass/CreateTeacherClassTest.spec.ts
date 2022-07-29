import { superAppRequest } from "../../setup";

describe("Create TeacherClass Controller", () => {
    it("should be able to create a TeacherClass", async () => {
            const teacherClassRequestBody = {
                teacherId: "6fafe55d-8e06-43a2-8a71-0978d32acb2c",
	            classId: "86564eb1-7266-4afb-bf5c-6aed7b24b1f1"
            }

            const teacherClassResponse = await superAppRequest
            .post("/classes/teacher")
            .send(teacherClassRequestBody);


        expect(teacherClassResponse.status).toBe(201);
        expect(teacherClassResponse.body.error).toBeFalsy();
    });

});