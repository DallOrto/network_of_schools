import { School } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";

    
class ListSchoolsService {
    
    async execute(): Promise<School[]> {
        
        const schools = await prismaDB.school.findMany({});

        return schools;
    }
}

export { ListSchoolsService }
