import { Class } from ".prisma/client";
import { prismaDB } from "../database/prismaClient";
import { ICreateClassDTO } from "../dtos/ICreateClassDTO";


class CreateClassService {
    async execute({name, classDay, time, schoolId}: ICreateClassDTO): Promise<Class> {
        
        const classRegister = await prismaDB.class.create({
            data: {
                name,
                classDay,
                time,
                schoolId
            }
        });

        return classRegister;
    }
}

export { CreateClassService }