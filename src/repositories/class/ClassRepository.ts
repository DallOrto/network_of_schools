import { Class, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateClassDTO } from "../../dtos/ICreateClassDTO";
import { IClassRepository } from "../class/implementations/IClassRepository";


class ClassRepository implements IClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async create({ name, classDay, time, schoolId }:ICreateClassDTO ): Promise<Class> {
        const classes = this.prismaRepository.class.create({
            data: {
                name,
                classDay,
                time,
                schoolId
            
            }
        });

        return classes;
    }
}

export { ClassRepository };