import { Teacher } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateTeacherDTO } from "../../dtos/ICreateTeacherDTO";


class CreateTeacherService {
    async execute({name, document, password, birthDate, schoolId}: ICreateTeacherDTO): Promise<Teacher>{
        
        const teacher = await prismaDB.teacher.create({
            data:{
                name, 
                document, 
                password, 
                birthDate, 
                schoolId
            }
        });

        return teacher;
    }
}

export { CreateTeacherService }