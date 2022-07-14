import { School } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateSchoolDTO } from "../../dtos/ICreateSchoolDTO";


class CreateSchoolService {
    async execute({ name, address, networkId}: ICreateSchoolDTO ): Promise<School> {

        // const schoolExists = await prismaDB.school.findUnique({
        //     where: {
        //         name,
        //         networkId
        //     }
        // });
        
        const school = await prismaDB.school.create({
            data:{
                name,
                address,
                networkId
            }
        });



        return school;

    }
}

export { CreateSchoolService }