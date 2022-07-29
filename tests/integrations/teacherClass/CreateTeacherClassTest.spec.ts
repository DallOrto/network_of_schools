import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Create TeacherClass Controller", () => {
    it("should be able to create a TeacherClass", async () => {
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

            const schoolResponse = await superAppRequest
            .post("/schools")
            .send(schoolRequestBody);

        const teacherRequestBody = {
                name: faker.name.findName(),
                document: faker.datatype.number().toString(),
                password: faker.internet.password(),
                birthDate:  faker.date.birthdate(),
                schoolId: schoolResponse.body.id
            }

            const teacherResponse = await superAppRequest
            .post("/teachers")
            .send(teacherRequestBody);

        const classRequestBody = {
                name: faker.name.findName(),
                classDay: faker.date.weekday(),
                time: faker.date.past(),
                schoolId: schoolResponse.body.id
            }

            const classResponse = await superAppRequest
            .post("/classes")
            .send(classRequestBody);

        const teacherClassRequestBody = {
                teacherId: teacherResponse.body.id,
	            classId: classResponse.body.id
            }

            const teacherClassResponse = await superAppRequest
            .post("/classes/teacher")
            .send(teacherClassRequestBody);

        expect(teacherClassResponse.status).toBe(201);
        expect(teacherClassResponse.body.error).toBeFalsy();
    });

});