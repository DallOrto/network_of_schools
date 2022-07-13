import { Student } from ".prisma/client";
import { prismaDB } from "../database/prismaClient";
import { ICreateStudentDTO } from "../dtos/ICreateStudentDTO";


class CreateStudentService {
    async execute({ name, document, password, birthDate, schoolId }: ICreateStudentDTO): Promise<Student> {
        
        const student = await prismaDB.student.create({
            data: {
                name, 
                document, 
                password, 
                birthDate, 
                schoolId
            }

        });

        return student;
    }
}

export { CreateStudentService } 