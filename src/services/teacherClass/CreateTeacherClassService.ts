import { TeacherClass } from ".prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { ICreateTeacherClassDTO } from "../../dtos/ICreateTeacherClassDTO";
import { AppError } from "../../error/AppError";


class CreateTeacherClassService {
    async execute({ teacherId, classId }: ICreateTeacherClassDTO): Promise<TeacherClass> {

        const teacherExists = await prismaDB.teacher.findUnique({
            where: {
                id: teacherId
            }
        });

        if(!teacherExists) {
            throw new AppError("Teacher does not exists!");
        }

        const classExists = await prismaDB.class.findUnique({
            where: {
                id: classId
            }
        });

        if(!classExists) {
            throw new AppError("Class does not exists!");
        }

        const teacherClass = await prismaDB.teacherClass.create({
            data: {
                teacherId,
                classId
            }
        });

        return teacherClass;

    }
}

export { CreateTeacherClassService }