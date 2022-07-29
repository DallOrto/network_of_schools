import { faker } from "@faker-js/faker";
import { superAppRequest } from "../../setup";

describe("Create StudentClass Controller", () => {
    it("should be able to create a StudentClass", async () => {
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

        const studentRequestBody = {
                name: faker.name.findName(),
                document: faker.datatype.number().toString(),
                password: faker.internet.password(),
                birthDate:  faker.date.birthdate(),
                schoolId: schoolResponse.body.id
            }

            const studentResponse = await superAppRequest
            .post("/students")
            .send(studentRequestBody);

            const classRequestBody = {
                name: faker.name.findName(),
                classDay: faker.date.weekday(),
                time: faker.date.past(),
                schoolId: schoolResponse.body.id
            }

            const classResponse = await superAppRequest
            .post("/classes")
            .send(classRequestBody);

        const studentClassRequestBody = {
                studentId: studentResponse.body.id,
	            classId: classResponse.body.id
            }

            const studentClassResponse = await superAppRequest
            .post("/classes/student")
            .send(studentClassRequestBody);

        expect(studentClassResponse.status).toBe(201);
        expect(studentClassResponse.body.error).toBeFalsy();
    });
});